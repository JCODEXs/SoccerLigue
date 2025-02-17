"use server";

import { db } from "@/server/db";

export async function findMatch(id: string) {
  const match = await db.match.findUnique({
    where: {
      id: id,
    },
    include: {
      events: true, // 
      homeTeam:{
        select: {name:true}
      },
      awayTeam:{
        select: {name:true}
      }
 
    },
    
   
   

  });

  return match;
}

export async function saveMatchToDatabase(match: {
  homeTeamId: string;
  awayTeamId: string;
  locationId: string;
  date: Date;
  time: string;
  judge: string;
}) {
  try {
    const newMatch = await db.match.create({
      data: {
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        locationId: match.locationId,
        date: match.date,
        time: match.time,
        judge: match.judge,
      },
    });

    return { success: true, id: newMatch.id };
  } catch (error) {
    console.error("Error saving match to database:", error);
    return { success: false, message: "Internal server error" };
  }
}
type MatchEvent = {
  type: string;
  team: string;
  player: string;
  assistant?: string;
  substitute?: string;
  card?: string;
  timestamp: string;
};
  type MatchData = {
  events: MatchEvent[];
  matchId: string;
  homeTeam:string;
  awayTeam:string;
};

export async function saveMatchData({ matchData }: { matchData: MatchData }) {
  console.log("Saving match data:", matchData);

  const { events, matchId, homeTeam, awayTeam }: MatchData = matchData;

  try {
    if (!events || !matchId || !homeTeam || !awayTeam) {
      throw new Error("Missing required fields");
    }

    
    const homeScore = events.filter((e) => e.team === homeTeam && e.type === "goal").length;
    const awayScore = events.filter((e) => e.team === awayTeam && e.type === "goal").length;
   

    // If there are events, process and save them
    if (events.length > 0) {
      // Calculate score

      // Format event data for bulk insertion
      const formattedEvents = events.map((event) => ({
        type: event.type,
        team: event.team,
        player: event.player,
        assistant: event.assistant || null,
        substitute: event.substitute || null,
        card: event.card || null,
        timestamp: event.timestamp,
        matchId, // Link event to match
      }));

      // Insert events into the database
      await prisma.event.createMany({ data: formattedEvents });
    }

    // Update match with score
   const updatedMatch = await prisma.match.update({
  where: {
    id: matchId,
  },
  data: {
    score: {
      upsert: {
        create: { homeScore: homeScore, awayScore: awayScore }, 
       update: { homeScore: homeScore, awayScore: awayScore },
      },
    },
  },
});


    console.log("Match and events saved successfully!");
    return { success: true, match: updatedMatch };

  } catch (error) {
    console.error("Error saving match data:", error);
    return { success: false, message: error.message || "Internal server error" };
  }
}


export async function getTeamsAndLocations() {
  try {
    const teams = await db.team.findMany({
      select: { id: true, name: true },
    });

    const Locations = await db.location.findMany({
      select: { id: true, name: true },
    });

    return { teams, Locations };
  } catch (error) {
    console.error("Error fetching teams and locations:", error);
    return { teams: [], locations: [] };
  }
}

export async function fetchPlayersByTeam  (teamName: string) {
  return await prisma.team.findUnique({
    where: { name: teamName },
    include: { players: true },
  });
};