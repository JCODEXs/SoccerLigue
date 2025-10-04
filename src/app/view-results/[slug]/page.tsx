"use client"
import Scoreboard from "@/components/scoreBoard";
import React, { use, useEffect, useState } from "react";
import { findMatch } from "../../actions/actions";
import type { Match, MatchData, MatchEvent, TeamStats } from "@/lib/types";
import { toast } from "sonner";

const ViewResultsPage = ({
    params,
}: {
  params: Promise<{ slug: string }>
}) =>{
const { slug } = use(params);
  const [matchSummary, setMatchSummary] = useState<MatchData| undefined>(undefined);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!slug) {
          setError("No match ID provided");
          setLoading(false);
          return;
        }

        const matchDataP: Match | null = await findMatch(slug);

        if (!matchDataP) {
          setError("Match not found");
          toast.error("Match not found");
          setLoading(false);
          return;
        }

        const { events: GameEvents } = matchDataP;

        if (!GameEvents || GameEvents.length === 0) {
          setError("No events found for this match");
          toast.error("No match events available");
          setLoading(false);
          return;
        }

        setMatch(matchDataP);

        const generatedData = generateMatchData(GameEvents, matchDataP);
        setMatchSummary(generatedData);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching match data:", error);
        setError("Failed to load match data. Please try again.");
        toast.error("Failed to load match data");
        setLoading(false);
      }
    };

    void fetchMatchData();
  }, [slug]);

  function generateMatchData(events: MatchEvent[], matchData: Match): MatchData {
    const homeTeamName = matchData.homeTeam?.name ?? "";
    const awayTeamName = matchData.awayTeam?.name ?? "";

    const teamStats: TeamStats = {
      homeTeam: {
        goals: 0,
        shots: 0,
        shotsOnTarget: 0,
        corners: 0,
        fouls: 0,
        cards: 0,
      },
      awayTeam: {
        goals: 0,
        shots: 0,
        shotsOnTarget: 0,
        corners: 0,
        fouls: 0,
        cards: 0,
      }
    };

    // Process events and calculate stats
    events.forEach((event) => {
      const { team, type, card } = event;

      if (team === homeTeamName) {
        // Count events for home team
        if (type === "goal") teamStats.homeTeam.goals += 1;
        if (type === "shot" || type === "free kick") teamStats.homeTeam.shots += 1;
        if (type === "shot on target") teamStats.homeTeam.shotsOnTarget += 1;
        if (type === "goal") teamStats.homeTeam.shotsOnTarget += 1;
        if (type === "corner kick") teamStats.homeTeam.corners += 1;
        if (type === "faul" || type === "penalty") teamStats.homeTeam.fouls += 1;
        if (card) teamStats.homeTeam.cards += 1;
      } else if (team === awayTeamName) {
        // Count events for away team
        if (type === "goal") teamStats.awayTeam.goals += 1;
        if (type === "shot" || type === "free kick") teamStats.awayTeam.shots += 1;
        if (type === "shot on target") teamStats.awayTeam.shotsOnTarget += 1;
        if (type === "goal") teamStats.awayTeam.shotsOnTarget += 1;
        if (type === "corner kick") teamStats.awayTeam.corners += 1;
        if (type === "faul" || type === "penalty") teamStats.awayTeam.fouls += 1;
        if (card) teamStats.awayTeam.cards += 1;
      }
    });

    // Build and return match data
    const processedMatchData: MatchData = {
      homeTeam: { name: homeTeamName, id: matchData.homeTeamId ?? "" },
      awayTeam: { name: awayTeamName, id: matchData.awayTeamId ?? "" },
      Location: matchData.location,
      locationId: matchData.locationId,
      referee: matchData.referee?.name ?? "Not assigned",
      date: matchData.date,
      time: matchData.time,
      scoreA: teamStats.homeTeam.goals,
      scoreB: teamStats.awayTeam.goals,
      stats: {
        shots: {
          homeTeam: teamStats.homeTeam.shots,
          awayTeam: teamStats.awayTeam.shots
        },
        shotsOnTarget: {
          homeTeam: teamStats.homeTeam.shotsOnTarget,
          awayTeam: teamStats.awayTeam.shotsOnTarget
        },
        corners: {
          homeTeam: teamStats.homeTeam.corners,
          awayTeam: teamStats.awayTeam.corners
        },
        fouls: {
          homeTeam: teamStats.homeTeam.fouls,
          awayTeam: teamStats.awayTeam.fouls
        },
        cards: {
          homeTeam: teamStats.homeTeam.cards,
          awayTeam: teamStats.awayTeam.cards
        },
      },
    };

    return processedMatchData;
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">⚽</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Loading Match Results</h2>
              <p className="text-gray-400">Please wait while we fetch the data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center">
              <span className="text-5xl">⚠️</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-3">Error Loading Match</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State - Show Scoreboard
  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {matchSummary ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Match Results</h1>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
                >
                  ← Back
                </button>
              </div>
            </div>

            {/* Scoreboard */}
            <Scoreboard matchData={matchSummary} />
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-400">No match data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResultsPage;
