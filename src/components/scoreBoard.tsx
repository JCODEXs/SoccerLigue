import React from "react";

// Define the type for the match data
interface MatchData {
  Date: string;
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
const Scoreboard: React.FC<{ matchData: MatchData }> = ({ matchData }) => {
  const { teamA, teamB, scoreA, scoreB, stats,Date } = matchData;

  return (
    
       <div className=" shadow-lg w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center ">
        <div className="text-2xl  font-bold text-center flex flex-row text-center bg-gradient-to-r from-teal-600 to-gray-800 rounded-tl-3xl rounded-br-3xl shadow-md ">
          <div className="text-4xl p-4 bg-gradient-to-r from-gray-800 to-teal-600 rounded-br-3xl rounded-tl-3xl">{scoreA}</div>
          <div className="align-center text2xl p-4  rounded-tl-3xl  mx-10 px-6 ">{teamA}</div>
        </div>
           <div className="flex justify-between items-center bg-gray-800 p-4  bg-blend-multiply rounded-b-3xl">
           <div className="flex justify-between items-center  p-2 rounded-2xl bg-blend-ligth text-white text-lg">
            {Date}
           </div>
           </div>
        <div className="text-2xl  font-bold text-center flex flex-row text-center bg-gradient-to-l from-teal-600 to-gray-800 rounded-bl-3xl rounded-br-3xl shadow-md">
          <div className=" align-center text2xl p-4  rounded-tr-3xl  mx-10 px-6">{teamB}</div>
          <div className="text-4xl p-4 bg-gradient-to-l from-gray-800 to-teal-600 rounded-br-3xl rounded-tl-3xl">{scoreB}</div>
        </div>
      </div>
<div className="bg-gray-800 text-white  rounded-b-xl shadow-lg w-full max-w-2xl mx-auto">
      {/* Statistics */}
      <div className="space-y-2">
          <div className="flex items-center justify-center  h-10 bg-gradient-to-l from-teal-200 to-teal-800 rounded-tr-lg p-2  bg-gradient-to-t from-teal-400 to-teal-800 rounded-tl-xl p-2 text-xl bg-gradient-to-l from-orange-800 to-orange-500">
          Match stats
          </div>
        {/* Shots */}
        <div className="flex justify-between items-center p-1 px-6">
          <span className="text-lg">{stats.shots.teamA}</span>
          <span className="text-white  ">Shots</span>
          <span className="text-lg">{stats.shots.teamB}</span>
        </div>

        {/* Shots on Target */}
        <div className="flex justify-between items-center bg-gradient-to-t from-teal-600 to-teal-800 rounded-lg p-2 px-6">
          <span className="text-lg ">{stats.shotsOnTarget.teamA}</span>
          <span className="text-white  ">Shots on Target</span>
          <span className="text-lg ">{stats.shotsOnTarget.teamB}</span>
        </div>

        {/* Corners */}
        <div className="flex justify-between items-center  rounded-lg p-1 px-6">
          <span className="text-lg">{stats.corners.teamA}</span>
          <span className="text-white">Corners</span>
          <span className="text-lg">{stats.corners.teamB}</span>
        </div>

        {/* Fouls */}
        <div className="flex justify-between items-center bg-gradient-to-t from-teal-600 to-teal-800 rounded-lg p-1 px-6">
          <span className="text-lg">{stats.fouls.teamA}</span>
          <span className="text-white">Fouls</span>
          <span className="text-lg">{stats.fouls.teamB}</span>
        </div>

        {/* Cards */}
        <div className="flex justify-between items-center rounded-lg p-2 px-6">
          <span className="text-lg">{stats.cards.teamA}</span>
          <span className="text-white">Cards</span>
          <span className="text-lg">{stats.cards.teamB}</span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Scoreboard;