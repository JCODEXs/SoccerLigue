import type { MatchData } from "@/lib/types";
import { formatDateToLetters } from "@/lib/utils";
import React from "react";

// Define the type for the match data


// Scoreboard Component
const Scoreboard: React.FC<{ matchData: MatchData }> = ({ matchData }) => {
  const { homeTeam, awayTeam, scoreA, scoreB, stats,date } = matchData;
console.log(matchData)
  return (
    
       <div className=" shadow-lg w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center ">
        <div className="md:text-2xl  font-bold text-center flex flex-row text-center bg-gradient-to-r from-teal-600 to-gray-800 rounded-tl-3xl rounded-br-3xl shadow-md ">
          <div className="text-3xl p-3 bg-gradient-to-r from-gray-800 to-teal-600 rounded-br-3xl rounded-tl-3xl ">{scoreA}</div>
          <div className="align-center lg:text-2xl p-2  rounded-tl-3xl  md:mx-10 px-6 sm:text-base md:text-xl ">{homeTeam?.name}</div>
        </div>
          <div className="flex justify-center items-center bg-gray-800 p-3 m-1 bg-blend-multiply rounded-b-3xl">
  <div className="flex flex-col justify-center  text-center items-center rounded-2xl bg-blend-light text-white text-sm sm:text-base">
    {formatDateToLetters(date)}
  </div>
</div>

        <div className="md:text-2xl  font-bold text-center flex flex-row text-center bg-gradient-to-l from-teal-600 to-gray-800 rounded-bl-3xl rounded-br-3xl shadow-md">
          <div className=" align-center lg:text-2xl p-2  rounded-tr-3xl  md:mx-10 px-6 sm:text-base md:text-xl">{awayTeam?.name}</div>
          <div className="text-3xl p-3 bg-gradient-to-l from-gray-800 to-teal-600 rounded-br-3xl rounded-tl-3xl ">{scoreB}</div>
        </div>
      </div>
<div className="bg-gray-800 text-white  rounded-b-xl shadow-lg  m-1 sm:m-3">
      {/* Statistics */}
      <div className="space-y-2 ">
          <div className="flex items-center justify-center  h-10 bg-gradient-to-l from-teal-200 to-teal-800 rounded-tr-lg p-2 bg-orange-300 bg-gradient-to-t from-teal-400 to-teal-800 rounded-tl-xl p-2 text-xl bg-gradient-to-l from-orange-800 to-orange-500">
          Match stats
          </div>
        {/* Shots */}
        <div className="flex justify-between items-center p-1 px-6">
          <span className="text-lg">{stats.shots.homeTeam}</span>
          <span className="text-white  ">Shots</span>
          <span className="text-lg">{stats.shots.awayTeam}</span>
        </div>

        {/* Shots on Target */}
        <div className="flex justify-between items-center bg-gradient-to-t from-teal-600 to-teal-800 rounded-lg p-2 px-6">
          <span className="text-lg ">{stats.shotsOnTarget.homeTeam}</span>
          <span className="text-white  ">Shots on Target</span>
          <span className="text-lg ">{stats.shotsOnTarget.awayTeam}</span>
        </div>

        {/* Corners */}
        <div className="flex justify-between items-center  rounded-lg p-1 px-6">
          <span className="text-lg">{stats.corners.homeTeam}</span>
          <span className="text-white">Corners</span>
          <span className="text-lg">{stats.corners.awayTeam}</span>
        </div>

        {/* Fouls */}
        <div className="flex justify-between items-center bg-gradient-to-t from-teal-600 to-teal-800 rounded-lg p-1 px-6">
          <span className="text-lg">{stats.fouls.homeTeam}</span>
          <span className="text-white">Fouls</span>
          <span className="text-lg">{stats.fouls.awayTeam}</span>
        </div>

        {/* Cards */}
        <div className="flex justify-between items-center rounded-lg p-2 px-6">
          <span className="text-lg">{stats.cards.homeTeam}</span>
          <span className="text-white">Cards</span>
          <span className="text-lg">{stats.cards.awayTeam}</span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Scoreboard;