"use client"
import Scoreboard from "@/components/scoreBoard";
import React, { use, useEffect, useState } from "react";
import { findMatch } from "../../actions/actions";
type MatchStats = {
  shots: { homeTeam: number; awayTeam: number };
  shotsOnTarget: { homeTeam: number; awayTeam: number };
  corners: { homeTeam: number; awayTeam: number };
  fouls: { homeTeam: number; awayTeam: number };
  cards: { homeTeam: number; awayTeam: number };
};
type MatchEvent = {
  team: string ;
  type: string;
  card: string | null;
  player: string;
  id: string;
  assistant: string | null;
  substitute: string | null;
  timestamp: string;
  matchId: string | null;
};


type MatchData = {
  Date: string;
  homeTeam: string;
  awayTeam: string;
  scoreA: number;
  scoreB: number;
  stats: MatchStats;
};

const ViewResultsPage = ({
    params,
}: {
  params: Promise<{ slug: string }>
}) =>{
const { slug } = use(params);
  console.log(slug)
  const [matchSummary, setMatchSummary] = useState<MatchData| null>(null);

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
        const generatedData = generateMatchData(GameEvents);
        setMatchSummary(generatedData);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    fetchMatchData();
  }, []);

  function generateMatchData(events: MatchEvent[]) {
    const matchData = {
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

    const teamStats = {};

    events.forEach((event) => {
      const { team, type, card } = event;

      if (!matchData.homeTeam) matchData.homeTeam = team;
      else if (team !== matchData.homeTeam && !matchData.awayTeam) matchData.awayTeam = team;

      if (!teamStats[team]) {
        teamStats[team] = {
          goals: 0,
          shots: 0,
          shotsOnTarget: 0,
          corners: 0,
          fouls: 0,
          cards: 0,
        };
      }

      // Count events
      if (type === "goal") teamStats[team].goals += 1;
      if (type === "shot" || type === "free kick") teamStats[team].shots += 1;
      if (type === "shot on target") teamStats[team].shotsOnTarget += 1;
      if (type === "corner") teamStats[team].corners += 1;
      if (type === "faul" || type === "penalty") teamStats[team].fouls += 1;
      if (card) teamStats[team].cards += 1;
    });

    matchData.scoreA = teamStats[matchData.homeTeam]?.goals || 0;
    matchData.scoreB = teamStats[matchData.awayTeam]?.goals || 0;
    matchData.stats.shots.homeTeam = teamStats[matchData.homeTeam]?.shots || 0;
    matchData.stats.shots.awayTeam = teamStats[matchData.awayTeam]?.shots || 0;
    matchData.stats.shotsOnTarget.homeTeam = teamStats[matchData.homeTeam]?.shotsOnTarget || 0;
    matchData.stats.shotsOnTarget.awayTeam = teamStats[matchData.awayTeam]?.shotsOnTarget || 0;
    matchData.stats.corners.homeTeam = teamStats[matchData.homeTeam]?.corners || 0;
    matchData.stats.corners.awayTeam = teamStats[matchData.awayTeam]?.corners || 0;
    matchData.stats.fouls.homeTeam = teamStats[matchData.homeTeam]?.fouls || 0;
    matchData.stats.fouls.awayTeam = teamStats[matchData.awayTeam]?.fouls || 0;
    matchData.stats.cards.homeTeam = teamStats[matchData.homeTeam]?.cards || 0;
    matchData.stats.cards.awayTeam = teamStats[matchData.awayTeam]?.cards || 0;

    return matchData;
  }

  return (
    <div className="pb-2">
      {matchSummary ? <Scoreboard matchData={matchSummary} /> : <div className="flex justify-center text-3xl text-teal-800 text-bold m-12 bg-gray-700 p-6 rounded-sm">Loading match data...</div>}
    </div>
  );
};

export default ViewResultsPage;
