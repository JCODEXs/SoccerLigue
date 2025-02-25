//add validations to the name position and number canot be empty and number must be a number if not corret return a message to the user
"use client" 
import React, { useState, use, useEffect } from 'react';
import { findPlayersByTeam, findTeam } from '@/app/actions/actions'
import {footballPositions} from '@/lib/utils'


const CreatePlayersPage= ({
    params,
}: {
  params: Promise<{ slug: string }>
}) =>{
const { slug:teamId } = use(params);
console.log(teamId)


    const [playersB, setPlayersB] = useState<{ name: string; position: string; number: number }[]>([]);
    const [players, setPlayers] = useState<{ name: string; position: string; number: number }[]>([]);
    const [playerName, setPlayerName] = useState<string>('');
    const [playerPosition, setPlayerPosition] = useState<string>('');
    const [playerNumber, setPlayerNumber] = useState<number>(0);
   
      useEffect(() => {
    const getPlayers = async () => {
      if (!teamId) return; // Ensure teamId is valid

      try {
        const fetchedPlayers = await findPlayersByTeam(teamId);
        setPlayersB(fetchedPlayers); // Update state with fetched players
        console.log(fetchedPlayers)
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

   void getPlayers(); // Call the function inside useEffect
  }, [teamId]);

    const addPlayer = () => {
        setPlayers([...players, { name: playerName, position: playerPosition, number: playerNumber }]);
        setPlayerName('');
        setPlayerPosition('');
        setPlayerNumber(0);
    };

  const savePlayers = async () => {
    try {
        const team= await findTeam(teamId);
        console.log("eam",team)
        if (!team) {
            throw new Error('Team not found');
        }   
        const response = await fetch('/api/teams', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teamId, players }),
        });

        if (!response.ok) {
            throw new Error('Failed to save players');
        }

        alert('Players saved successfully');
    } catch (error) {
        console.error('Error saving players:', error);
        alert('Failed to save players');
    }
};


    return (
        <div className=" bg-gray-800  p-2 m-2">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-2">Create Players For</h1> 
                <h1 className="text-2xl font-bold mb-2"> </h1> 
                <button
                        onClick={savePlayers}
                        className="px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        disabled={players.length === 0}
                    >
                        Save Players
                    </button>
            </div>
            <p>add players one by one and then save.</p>
            <div className="mb-2">
                <label className="block text-sm font-medium text-white">Player Name:</label>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="flex flex-row my-2 gap-3">
                <div className="w-45" >
                    <label className="block text-sm font-medium text-white">Player Position:</label>
                    <select
                    value={playerPosition}  
                    onChange={(e) => setPlayerPosition(e.target.value)}
                    className="mt-1 block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                    ">
                    <option value="">Select Position</option>
                    {footballPositions.map((position) => (
                        <option key={position.abbreviation} value={position.abbreviation}>
                            {position.name}
                        </option>
                    ))}
                </select>
                </div>
                <div className="w-54 flex flex-col justify-between">
                    <label className=" text-sm font-medium text-white">Player Number:</label>
                    <input
                        type="number"
                        value={playerNumber}
                        onChange={(e) => setPlayerNumber(Number(e.target.value))}
                        className="mt-1 w-14 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
           
                <button
                    onClick={addPlayer}
                    className="mr-2 px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 w-full"
                >
                    Add Player
                </button>
               
            <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-white">Players List</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {playersB.map((player, index) => (
    <div
      key={index}
      className="bg-gray-700 text-white p-3 rounded-lg shadow-md border border-gray-600 flex flex-row align-center gap-2 justify-between"
    >
      <h3 className="text-lg font-semibold ">{player.name}</h3>
      <p className="text-lg text-gray-300 ">Position: {player.position}</p>
      <p className="text-lg text-gray-300 ">Number: {player.number}</p>
    </div>
  ))}
</div>
            <h2 className="text-xl font-bold mb-4 text-white">New Players to add</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {players.map((player, index) => (
    <div
      key={index}
      className="bg-gray-700 text-white p-3 rounded-lg shadow-md border border-gray-600 flex flex-row align-center gap-2 justify-between"
    >
      <h3 className="text-lg font-semibold ">{player.name}</h3>
      <p className="text-lg text-gray-300 ">Position: {player.position}</p>
      <p className="text-lg text-gray-300 ">Number: {player.number}</p>
    </div>
  ))}
</div>

            </div>
        </div>
    );
};

export default CreatePlayersPage