"use server";

import type { Match, Team } from "@/lib/types";
import { db } from "@/server/db";


export async function findMatch(id: string) {
  const match:Match|null = await db.match.findUnique({
    where: {
      id: id,
    },
    include: {
      events: true, // 
      homeTeam:{
        select: {name:true,
          id:true
        }
      },
      awayTeam:{
        select: {name:true
        ,id:true,
        }
      },
      Location:true,
      referee:true
      
    },
  });

  return match;
}

export async function findPlayersByTeam(teamId: string) {
  const players = await db.player.findMany({
    where: { teamId },
  });

  return players;
}
export async function findTeam(teamId: string) {
  const team = await db.team.findMany({
    where: { id:teamId },
  });

  return team;
}


export async function saveMatchToDatabase(match: {
  homeTeamId: string;
  awayTeamId: string;
  locationId: string;
  date: Date;
  refereeId: string;
  time: string;
}) {
  try {
    const newMatch = await db.match.create({
      data: {
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        locationId: match.locationId,
        date: match.date,
        time: match.time,
        refereeId: match.refereeId,
      },
    });

    return { success: true, id: newMatch.id };
  } catch (error) {
    console.error("Error saving match to database:", error);
    return { success: false, message: "Internal server error" };
  }
}
export async function updateMatchInDatabase(matchId: string, updatedMatch: {
  homeTeamId: string;
  awayTeamId: string;
  locationId: string;
  date: Date;
  refereeId: string;
  time: string;
}) {
  try {
    const updatedMatchRecord = await db.match.update({
      where: { id: matchId },
      data: {
        homeTeamId: updatedMatch.homeTeamId,
        awayTeamId: updatedMatch.awayTeamId,
        locationId: updatedMatch.locationId,
        date: updatedMatch.date,
        time: updatedMatch.time,
        refereeId: updatedMatch.refereeId,
      },
    });

    return { success: true, match: updatedMatchRecord };
  } catch (error) {
    console.error("Error updating match in database:", error);
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
  console.log("Saving match data: (server)", matchData);

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
        assistant: event.assistant ?? null,
        substitute: event.substitute ?? null,
        card: event.card ?? null,
        timestamp: event.timestamp,
        matchId, // Link event to match
      }));

      // Insert events into the database
      await db.event.createMany({ data: formattedEvents });
    }

    // Update match with score
//    const updatedMatch = await db.match.update({
//   where: {
//     id: matchId,
//   },
//   data: {
//     score: {
//       upsert: {
//         create: { homeScore: homeScore, awayScore: awayScore }, 
//        update: { homeScore: homeScore, awayScore: awayScore },
//       },
//     },
//   },
// });


//     console.log("Match and events saved successfully!");
   return { success: true, message: "Match and events saved successfully!" };

  }  catch (error) {
  console.error("Error saving match data:", error);
  return { 
    success: false, 
    message: (error as Error).message || "Internal server error" 
  };

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
    const Referees = await db.referee.findMany({
      select: { id: true, name: true },
    }); 

    return { teams, Locations,Referees };
  } catch (error) {
    console.error("Error fetching teams and locations:", error);
    return { teams: [], locations: [] };
  }
}

export async function fetchPlayersByTeam  (teamName: string) {
  return await db.team.findUnique({
    where: { name: teamName },
    include: { players: true },
  });
};
export async function createRefereeAction(newreferee:string){
 try {
    if (!newreferee || typeof newreferee !== "string") {
      throw new Error("Invalid referee name");
    }
  const Referee= await db.referee.create({
    data: {
      name: newreferee,
    }
  });
  return Referee;
  
}catch(error){
  console.error("Error creating referee:", error);
  return null;
}
}
export async function createLocationAction(newLocation:string){
 try {
    if (!newLocation || typeof newLocation !== "string") {
      throw new Error("Invalid Location name");
    }
  const Location= await db.location.create({
    data: {
      name: newLocation,
    }
  });
  return Location;
  
}catch(error){
  console.error("Error creating Location:", error);
  return null;
}
}