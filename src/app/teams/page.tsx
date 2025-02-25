/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Player } from "@/lib/types";
type Team={

  id:string;
  name:string;
  players:Player[];

}

type TeamClub= {
  succes:boolean;
  teams:Team[];
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamClub>();
  const [loading, setLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newPlayer, setNewPlayer] = useState({ name: "", position: "", number: "" });
const router=useRouter();
  useEffect(() => {
   void fetchTeams();
  }, []);
 

  const fetchTeams = async () => {
    setLoading(true);
    const response= await fetch("/api/teams");
    
    const data:TeamClub= await response.json();
    console.log("data",data)
    setTeams(data);
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
      void fetchTeams();
      setNewTeamName("");
    }
  };

const deleteTeam = async (teamId: string) => {
  await fetch(`/api/teams`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamId }),
  });
  void fetchTeams();
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
      body: JSON.stringify({ teamId, name: newPlayer.name, position: newPlayer.position, number: newPlayer.number }),
      headers: { "Content-Type": "application/json" },
    });

    void fetchTeams();
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
        <Button onClick={createTeam} className="bg-teal-600 hover:bg-teal-800 w-full">
          Create Team
        </Button>
      </div>

      {/* List Teams */}
     {loading ? (
  <p>Loading...</p>
) : teams?.teams&&teams.teams?.length > 0 ? ( // ✅ Ensure teams exist
  <ul>
    {teams.teams.map((team) => (
      <li key={team.id} className="bg-gray-800 p-4 mb-2 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <div className="flex flex-wrap gap-2 items-center w-1/3">
            <Button onClick={() => deleteTeam(team.id)} className="bg-red-500 hover:bg-red-600">
              Delete
            </Button>
             <Button onClick={() => router.push(`/createPlayers/${team.id}`)} className="bg-orange-500 hover:bg-blue-600">
              Edit Team
            </Button>
          </div>
        </div>
     {/* <label className="text-md mt-3">Players:</label> */}

{team.players.length > 0 ? (
  <table className="min-w-full border-collapse border shadow-md rounded-full">
    <caption className="caption-top text-gray-400">Players List

    </caption>
    <thead>
      <tr className="bg-teal-800 text-gray-800 ">
        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Number</th>
      </tr>
    </thead>
    <tbody>
      {team.players.map((player) => (
        <tr key={player.name} className="odd:bg-gray-400 bg-gray-500 hover:bg-teal-200 transition-colors duration-200">
          <td className="border border-gray-300 px-4 py-2 text-black">{player.name}</td>
          <td className="border border-gray-300 px-4 py-2 text-black">{player.position}</td>
          <td className="border border-gray-300 px-4 py-2 text-center text-black">{player.number}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="text-gray-400">No players</p>
)}


        {/* Add Player */}
        <div className="mt-2 flex flex-wrap gap-2">
          {/* <Input
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
          /> */}
         
        </div>
      </li>
    ))}
  </ul>
) : (
  // ✅ Show an option to create a new team when no teams exist
  <div className="text-center mt-4">
    <p className="text-gray-400">No teams available. Create a new team to get started.</p>
    <Button onClick={()=>router.push("/createTeam")} className="mt-2 bg-green-500 hover:bg-green-600">
      Create New Team
    </Button>
  </div>
)}
    
    </div>
  );
}
