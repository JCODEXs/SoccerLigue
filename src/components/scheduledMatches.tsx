"use client"

import { formatDateToLetters } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";

const ScheduledMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [teamFilter, setTeamFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
   const [teams, setTeams] = useState<string[]>([]);

  // Obtener los partidos programados desde la base de datos
    useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/matches', {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await res.json() as Match[];
console.log("match",data)
        setMatches(data);
        setFilteredMatches(data);
            // Extract unique teams from homeTeam and awayTeam
       const teamList = [
        ...new Set(
          data.flatMap((match) => [match?.homeTeam?.name, match?.awayTeam?.name])
        ),
      ].filter((team): team is string => !!team);
      console.log("teams",teamList)
      setTeams(teamList);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

   void  fetchMatches();
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
    <div className="p-4 md:p-6 bg-gray-800 text-white rounded-xl shadow-2xl">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⚽</span>
          <h2 className="text-2xl md:text-3xl font-bold text-orange-400">
            Scheduled Matches
          </h2>
        </div>
        <p className="text-gray-400 text-sm md:text-base">
          {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'} found
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-750 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🔍</span>
          <h3 className="text-lg font-semibold text-gray-300">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Filter by Team
            </label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        {(teamFilter || dateFilter) && (
          <button
            onClick={() => {
              setTeamFilter("");
              setDateFilter("");
            }}
            className="mt-3 text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            ✕ Clear all filters
          </button>
        )}
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <Link
              href={`/matchesDetails/${match.id}`}
              key={match.id}
              className="block"
            >
              <div className="bg-gradient-to-br from-gray-700 to-gray-750 rounded-xl p-4 md:p-5 border border-gray-600 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer group">
                {/* Match Header - Teams */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4">
                    <div className="text-center md:text-right flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {match?.homeTeam?.name ?? 'TBD'}
                      </h3>
                      <span className="text-xs text-gray-400">Home</span>
                    </div>

                    <div className="flex items-center justify-center px-3 py-2 bg-gray-800 rounded-lg border border-gray-600">
                      <span className="text-xl md:text-2xl font-bold text-orange-400">VS</span>
                    </div>

                    <div className="text-center md:text-left flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {match?.awayTeam?.name ?? 'TBD'}
                      </h3>
                      <span className="text-xs text-gray-400">Away</span>
                    </div>
                  </div>
                </div>

                {/* Match Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-600">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-300">
                        {formatDateToLetters(match.date)}
                      </p>
                      <p className="text-xs text-gray-400">
                        🕐 {match.time}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm font-semibold text-gray-300">
                        {match?.location?.name ?? 'TBD'}
                      </p>
                    </div>
                  </div>

                  {/* Referee */}
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-lg">👨‍⚖️</span>
                    <div>
                      <p className="text-xs text-gray-400">Referee</p>
                      <p className="text-sm font-semibold text-gray-300">
                        {match?.referee?.name ?? 'TBD'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="mt-3 pt-3 border-t border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-center text-sm text-teal-400">
                    Click to view match details →
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-700 rounded-xl border border-gray-600">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl text-gray-300 font-semibold mb-2">No matches found</p>
            <p className="text-sm text-gray-400">
              {teamFilter || dateFilter
                ? "Try adjusting your filters"
                : "No scheduled matches available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledMatches;