"use client"

import { formatDateToLetters } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol } from "@fortawesome/free-solid-svg-icons";
import type { Match,} from "@/lib/types";


const ScheduledMatchesToResults: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [teamFilter, setTeamFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
   const [teams, setTeams] = useState<string[]>([""]);

  // Obtener los partidos programados desde la base de datos
    useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/matches');
        if (!res.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await res.json() as Match[];
console.log("match",data)
        setMatches(data);
        setFilteredMatches(data);
            // Extract unique teams from homeTeam and awayTeam
      const teamList = [
        ...new Set(data.flatMap((match) => [match?.homeTeam?.name??"", match?.awayTeam?.name??""])),
      ];
      console.log("teams",teamList)
      if(teamList){
      setTeams(teamList);
      }
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

   void fetchMatches();
  }, []); // This effect runs only once when the component mounts

   const encodeMatchData = (match: Match) => {
    return encodeURIComponent(JSON.stringify(match)); // Encode each match's data
  };

  // This useEffect watches for changes in the "matches" state
  useEffect(() => {
    console.log("Updated matches:", matches); 
  }, [matches]);

  // Filtrar partidos por equipo y fecha
  useEffect(() => {
    let filtered = matches;

    if (teamFilter) {
      filtered = filtered.filter(
        (match) =>
          match?.homeTeam?.name.toLowerCase().includes(teamFilter.toLowerCase()) ??
          match?.awayTeam?.name.toLowerCase().includes(teamFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (match) => new Date(match.date).toISOString().split("T")[0] === dateFilter
      );
    }

    setFilteredMatches(filtered);
  }, [teamFilter, dateFilter, matches]);

  return (
    <div className="p-3 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-3 text-orange-400">
        Scheduled Matches
      </h2>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option key={"empty"}value="">Filter by team...</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {/* Lista de partidos */}
      {/* <pre>{JSON.stringify(matches, null ,2 )}</pre> */}
      <div className="space-y-2">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div
              className="p-1 bg-gray-700 rounded-sm hover:bg-gray-600 transition-colors duration-200 sm:p-3"
              key={match.id}
            >
            
            <Link href={`/view-results/${match.id}`}>
           
            
              <div className="flex flex-col justify-between items-center">
                <div className="text-lg font-bold text-orange-400  ">
                {match?.events&&<FontAwesomeIcon icon={faFutbol} size="1x" color="white" />}  {match?.homeTeam?.name} vs {match?.awayTeam?.name} 
                </div>
                <div className="text-md gap-2 flex text-gray-300 flex-col sm:flex-row">
                  {formatDateToLetters(match.date)} at {match.time}
              <div className="flex justify-between gap-2 items-center md:flex-row">
              <div className="text-sm text-gray-300 ">
                {/* Location:  */}
                {match?.Location?.name}
              </div>
              <div className="text-sm text-gray-300  ">
                Referee: {""}
                {match?.referee?.name}
              </div>
                </div>
              </div>

            </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default ScheduledMatchesToResults;