"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TeamsPage() {
  const [teams, setTeams] = useState<{ id: string; name: string; players: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newPlayer, setNewPlayer] = useState({ name: "", position: "", number: "" });

  useEffect(() => {
    fetchTeams();
  }, []);
  console.log(teams)

  const fetchTeams = async () => {
    setLoading(true);
    const response = await fetch("/api/teams");
    const data = await response.json();
    setTeams(data.teams);
    setLoading(false);
  };

  const createTeam = async () => {
    if (!newTeamName) return;
    const response = await fetch("/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: newTeamName, players: [] }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      fetchTeams();
      setNewTeamName("");
    }
  };

const deleteTeam = async (teamId: string) => {
  await fetch(`/api/teams`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamId }),
  });
  fetchTeams();
};

const reassignPlayer = async (playerId: string, newTeamId: string) => {
  await fetch("/api/players", {
    method: "PATCH",
    body: JSON.stringify({ playerId, newTeamId }),
  });
  // Refresh the player list if necessary
};

  const addPlayer = async (teamId: string) => {
    if (!newPlayer.name || !newPlayer.position || !newPlayer.number) return;

    await fetch("/api/teams", {
      method: "PATCH",
      body: JSON.stringify({ teamId, ...newPlayer }),
      headers: { "Content-Type": "application/json" },
    });

    fetchTeams();
    setNewPlayer({ name: "", position: "", number: "" });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Manage Teams</h2>

      {/* Create Team */}
      <div className="mb-4">
        <Input
          placeholder="Enter Team Name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="text-white mb-2"
        />
        <Button onClick={createTeam} className="bg-green-500 hover:bg-green-600 w-full">
          Create Team
        </Button>
      </div>

      {/* List Teams */}
      {loading ? <p>Loading...</p> : (
        <ul>
          {teams.map((team) => (
            <li key={team.id} className="bg-gray-800 p-4 mb-2 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <Button onClick={() => deleteTeam(team.id)} className="bg-red-500 hover:bg-red-600">
                  Delete
                </Button>
              </div>
              <p className="text-sm mt-2">Players:</p>
              <ul className="ml-4">
                {team.players.length > 0 ? (
                  team.players.map((player) => (
                    <li key={player.id} className="text-sm">
                      {player.name} ({player.position}) - #{player.number}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No players</li>
                )}
              </ul>

              {/* Add Player */}
              <div className="mt-2 flex flex-wrap gap-2">
                <Input
                  placeholder="Name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="text-white w-1/3"
                />
                <Input
                  placeholder="Position"
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                  className="text-white w-1/3"
                />
                <Input
                  type="number"
                  placeholder="Number"
                  value={newPlayer.number}
                  onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                  className="text-white w-1/3"
                />
                <Button onClick={() => addPlayer(team.id)} className="bg-blue-500 hover:bg-blue-600">
                  Add Player
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
