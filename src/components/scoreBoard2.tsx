import React from "react";

// Define the type for the match data
interface MatchData {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  stats: {
    shots: { teamA: number; teamB: number };
    shotsOnTarget: { teamA: number; teamB: number };
    corners: { teamA: number; teamB: number };
    fouls: { teamA: number; teamB: number };
    cards: { teamA: number; teamB: number };
  };
}

// Scoreboard Component
const Scoreboard2: React.FC<{ matchData: MatchData }> = ({ matchData }) => {
  const { teamA, teamB, scoreA, scoreB, stats } = matchData;

 return (
    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      {/* Team Names and Scores */}
      <div className="flex justify-between items-center mb-8">
        {/* Team A */}
        <div className="text-center bg-gradient-to-r from-teal-600 to-teal-800 p-4 rounded-tl-3xl rounded-br-3xl shadow-md">
          <p className="text-3xl font-bold">{teamA}</p>
          <p className="text-6xl font-bold text-orange-400">{scoreA}</p>
        </div>

        {/* Team B */}
        <div className="text-center bg-gradient-to-r from-terracotta-600 to-terracotta-800 p-4 rounded-tr-3xl rounded-bl-3xl shadow-md">
          <p className="text-3xl font-bold">{teamB}</p>
          <p className="text-6xl font-bold text-orange-400">{scoreB}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-6">
        {/* Shots */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-teal-400">{stats.shots.teamA}</span>
            <span className="text-xl text-gray-300 underline">Shots</span>
            <span className="text-2xl font-bold text-terracotta-400">{stats.shots.teamB}</span>
          </div>
          <div className="text-center text-sm text-orange-300 mt-1">Total Attempts</div>
        </div>

        {/* Shots on Target */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-teal-400">{stats.shotsOnTarget.teamA}</span>
            <span className="text-xl text-gray-300 underline">Shots on Target</span>
            <span className="text-2xl font-bold text-terracotta-400">{stats.shotsOnTarget.teamB}</span>
          </div>
          <div className="text-center text-sm text-orange-300 mt-1">On Target</div>
        </div>

        {/* Corners */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-teal-400">{stats.corners.teamA}</span>
            <span className="text-xl text-gray-300 underline">Corners</span>
            <span className="text-2xl font-bold text-terracotta-400">{stats.corners.teamB}</span>
          </div>
          <div className="text-center text-sm text-orange-300 mt-1">Corner Kicks</div>
        </div>

        {/* Fouls */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-teal-400">{stats.fouls.teamA}</span>
            <span className="text-xl text-gray-300 underline">Fouls</span>
            <span className="text-2xl font-bold text-terracotta-400">{stats.fouls.teamB}</span>
          </div>
          <div className="text-center text-sm text-orange-300 mt-1">Fouls Committed</div>
        </div>

        {/* Cards */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-teal-400">{stats.cards.teamA}</span>
            <span className="text-xl text-gray-300 underline">Cards</span>
            <span className="text-2xl font-bold text-terracotta-400">{stats.cards.teamB}</span>
          </div>
          <div className="text-center text-sm text-orange-300 mt-1">Yellow/Red Cards</div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard2;