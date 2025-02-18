"use client"
import Scoreboard from "@/components/scoreBoard";
import React, { use, useEffect, useState } from "react";
import { findMatch } from "../../actions/actions";
import type { MatchData, MatchEvent, TeamStats } from "@/lib/types";

const ViewResultsPage = ({
    params,
}: {
  params: Promise<{ slug: string }>
}) =>{
const { slug } = use(params);
  console.log(slug)
  const [matchSummary, setMatchSummary] = useState<MatchData| null>(null);
  const [homeTeam, sethomeTeam] = useState<string>();
  const [awayTeam, setawayTeam] = useState<string>();
console.log("hometeam",homeTeam)
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
         if (!slug) return;
        const matchDataP = await findMatch(slug);
     
  if (!matchDataP) {
  console.error("Match not found");
  return;
  }
  const { events: GameEvents } = matchDataP; // Now it's safe to destructure
    console.log("este", matchDataP);
    sethomeTeam(matchDataP.homeTeam?.name)
    setawayTeam(matchDataP.awayTeam?.name)
        const generatedData = generateMatchData(GameEvents);
        setMatchSummary(generatedData);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    fetchMatchData();
  }, [slug,homeTeam,awayTeam]);

  function generateMatchData(events: MatchEvent[]) {
    const matchData:MatchData = {
      Date: "2025-02-28",
      homeTeam: "",
      awayTeam: "",
      scoreA: 0,
      scoreB: 0,
      stats: {
        shots: { homeTeam: 0, awayTeam: 0 },
        shotsOnTarget: { homeTeam: 0, awayTeam: 0 },
        corners: { homeTeam: 0, awayTeam: 0 },
        fouls: { homeTeam: 0, awayTeam: 0 },
        cards: { homeTeam: 0, awayTeam: 0 },
      },
    };

    const teamStats:TeamStats = {
     homeTeam: { goals: 0,
           shots: 0,
           shotsOnTarget: 0,
           corners: 0,
           fouls: 0,
           cards: 0,
          },
     awayTeam: { goals: 0,
           shots: 0,
           shotsOnTarget: 0,
           corners: 0,
           fouls: 0,
           cards: 0,}
    };

    events.forEach((event) => {
      const { team, type, card } = event;
      console.log(event,team,homeTeam,team==homeTeam)
      if (team===homeTeam) 
      
   {
     // Count events
     if (type === "goal") teamStats.homeTeam.goals += 1;
     if (type === "shot" || type === "free kick") teamStats.homeTeam.shots += 1;
     if (type === "shot on target") teamStats.homeTeam.shotsOnTarget += 1;
     if (type === "goal") teamStats.homeTeam.shotsOnTarget += 1;
     if (type === "corner") teamStats.homeTeam.corners += 1;
     if (type === "faul" || type === "penalty") teamStats.homeTeam.fouls += 1;
     if (card) teamStats.homeTeam.cards += 1;
   }else if (team===awayTeam)
      {
           if (type === "goal") teamStats.awayTeam.goals += 1;
     if (type === "shot" || type === "free kick") teamStats.awayTeam.shots += 1;
     if (type === "shot on target") teamStats.awayTeam.shotsOnTarget += 1;
     if (type === "goal") teamStats.awayTeam.shotsOnTarget += 1;
     if (type === "corner") teamStats.awayTeam.corners += 1;
     if (type === "faul" || type === "penalty") teamStats.awayTeam.fouls += 1;
     if (card) teamStats.awayTeam.cards += 1;
      }
     

    });

    matchData.scoreA = teamStats.homeTeam?.goals || 0;
    matchData.scoreB = teamStats.awayTeam?.goals || 0;
    matchData.stats.shots.homeTeam = teamStats.homeTeam?.shots || 0;
    matchData.stats.shots.awayTeam = teamStats.awayTeam?.shots || 0;
    matchData.stats.shotsOnTarget.homeTeam = teamStats.homeTeam?.shotsOnTarget || 0;
    matchData.stats.shotsOnTarget.awayTeam = teamStats.awayTeam?.shotsOnTarget || 0;
    matchData.stats.corners.homeTeam = teamStats.homeTeam?.corners || 0;
    matchData.stats.corners.awayTeam = teamStats.awayTeam?.corners || 0;
    matchData.stats.fouls.homeTeam = teamStats.homeTeam?.fouls || 0;
    matchData.stats.fouls.awayTeam = teamStats.awayTeam?.fouls || 0;
    matchData.stats.cards.homeTeam = teamStats.homeTeam?.cards || 0;
    matchData.stats.cards.awayTeam = teamStats.awayTeam?.cards || 0;
console.log("que cosa",matchData)
    return matchData;
  }

  return (
    <div className="pb-2">
      {matchSummary ? <Scoreboard matchData={matchSummary} /> : <div className="flex justify-center text-3xl text-teal-800 text-bold m-12 bg-gray-700 p-6 rounded-sm">Loading match data...</div>}
    </div>
  );
};

export default ViewResultsPage;
