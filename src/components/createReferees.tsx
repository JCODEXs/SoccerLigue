"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRefereeAction } from "@/app/actions/actions";

export default function CreateReferee() {
  const [RefereeName, setRefereeName] = useState<string>("");
  // const [players, setPlayers] = useState<{ name: string; position: string; number: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");



  const handleCreateReferee = async () => {
   
    setLoading(true);
    setSuccessMessage("");
// console.log("players",players)
    try {
       if (!RefereeName) {return}
      const response= await createRefereeAction(RefereeName)

      if (response) {
        setSuccessMessage("Referee successfully created!");
        setRefereeName("");
        // setPlayers([]);
      } else {
        setErrorMessage("Error creating team.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Inscribe a Refereee</h2>

      {/* Team Name Input */}
      <Input
        placeholder="Enter Referee Name"
        value={RefereeName}
        onChange={(e) => setRefereeName(e.target.value)}
        className="mb-4 text-white"
      />

      {errorMessage && <p className="text-center mt-4 text-red-400">{errorMessage}</p>}

      {/* Player List */}
      {/* <div className="mt-4">
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
      </div> */}

      {/* Submit Button */}
      <Button
        onClick={handleCreateReferee}
        disabled={loading}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500"
      >
        {loading ? "Saving..." : "Create Referee"}
      </Button>

      {/* Success Message */}
      {successMessage && <p className="text-center mt-4 text-green-400">{successMessage}</p>}
    </div>
  );
}
