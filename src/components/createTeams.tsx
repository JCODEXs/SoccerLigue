"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [position, setPosition] = useState("");
  const [number, setNumber] = useState("");
  const [players, setPlayers] = useState<{ name: string; position: string; number: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const addPlayer = () => {
    if (!playerName || !position || !number) return;
    setPlayers([...players, { name: playerName, position, number: Number(number) }]);
    setPlayerName("");
    setPosition("");
    setNumber("");
  };

  const createTeam = async () => {
    if (!teamName || players.length === 0) return;
    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/create-team", {
        method: "POST",
        body: JSON.stringify({ name: teamName, players }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSuccessMessage("Team successfully created!");
        setTeamName("");
        setPlayers([]);
      } else {
        setSuccessMessage("Error creating team.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Create a Team</h2>

      {/* Team Name Input */}
      <Input
        placeholder="Enter Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="mb-4 text-white"
      />

      {/* Player Inputs */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="text-white"
        />
        <Input
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="text-white"
        />
        <Input
          type="number"
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="text-white"
        />
        <Button onClick={addPlayer} className="bg-green-500 hover:bg-green-600">
          Add
        </Button>
      </div>

      {/* Player List */}
      <div className="mt-4">
        {players.length > 0 && (
          <ul className="bg-gray-800 p-4 rounded-lg">
            {players.map((player, index) => (
              <li key={index} className="flex justify-between border-b py-1">
                <span>{player.name} ({player.position})</span>
                <span className="font-bold">#{player.number}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={createTeam}
        disabled={loading}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500"
      >
        {loading ? "Saving..." : "Create Team"}
      </Button>

      {/* Success Message */}
      {successMessage && <p className="text-center mt-4 text-green-400">{successMessage}</p>}
    </div>
  );
}
