"use client"
import React, { useState, use, useEffect } from 'react';
import { findPlayersByTeam} from '@/app/actions/actions'
import {footballPositions} from '@/lib/utils'
import { toast } from "sonner"
// import { useSession } from "next-auth/react";

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
    const [playerNumber, setPlayerNumber] = useState<number | ''>('');
    const [validationError, setValidationError] = useState<string>('');

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

    const validatePlayer = (): boolean => {
        // Clear previous errors
        setValidationError('');

        // Check if name is empty or only whitespace
        if (!playerName.trim()) {
            setValidationError('Player name is required');
            return false;
        }

        // Check if position is selected
        if (!playerPosition) {
            setValidationError('Player position is required');
            return false;
        }

        // Check if number is valid
        if (playerNumber === '' || playerNumber < 1 || playerNumber > 99) {
            setValidationError('Player number must be between 1 and 99');
            return false;
        }

        // Check for duplicate numbers in existing players
        const allPlayers = [...playersB, ...players];
        const isDuplicateNumber = allPlayers.some(p => p.number === Number(playerNumber));
        if (isDuplicateNumber) {
            setValidationError(`Number ${playerNumber} is already assigned to another player`);
            return false;
        }

        return true;
    };

    const addPlayer = () => {
        if (!validatePlayer()) {
            return;
        }

        setPlayers([...players, { name: playerName.trim(), position: playerPosition, number: Number(playerNumber) }]);
        setPlayerName('');
        setPlayerPosition('');
        setPlayerNumber('');
        setValidationError('');
    };

    const removePlayer = (index: number) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    // Check if the add button should be enabled
    const isAddButtonDisabled = !playerName.trim() || !playerPosition || playerNumber === '' || Number(playerNumber) < 1;

  const savePlayers = async () => {
    try {
        if (!teamId) {
            throw new Error('Team ID is required');
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

        toast('Players saved successfully');

        // Clear the new players list
        setPlayers([]);

        // Refresh the existing players list
        const fetchedPlayers = await findPlayersByTeam(teamId);
        setPlayersB(fetchedPlayers);

    } catch (error) {
        console.error('Error saving players:', error);
        toast('Failed to save players');
    }
};


// const { data: session } = useSession();

// if (!session) {
//   return <p>You must be logged in to view this page.</p>;
// }
    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Manage Team Players</h1>
                            <p className="text-gray-400 text-sm">Add new players to your team roster</p>
                        </div>
                        <button
                            onClick={savePlayers}
                            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold shadow-md w-full sm:w-auto"
                            disabled={players.length === 0}
                        >
                            💾 Save {players.length > 0 && `(${players.length})`} Player{players.length !== 1 ? 's' : ''}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Add Player Form */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">➕</span> Add New Player
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">All fields are required</p>

                        {/* Validation Error Message */}
                        {validationError && (
                            <div className="mb-4 p-4 bg-red-600/20 border border-red-600 text-red-200 rounded-lg flex items-start gap-2">
                                <span className="text-xl">⚠️</span>
                                <span>{validationError}</span>
                            </div>
                        )}

                        {/* Player Name Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Player Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter player full name"
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Position and Number Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Position <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={playerPosition}
                                    onChange={(e) => setPlayerPosition(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select Position</option>
                                    {footballPositions.map((position) => (
                                        <option key={position.abbreviation} value={position.abbreviation}>
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Jersey Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={playerNumber}
                                    onChange={(e) => setPlayerNumber(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="1-99"
                                    min="1"
                                    max="99"
                                    required
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button
                            onClick={addPlayer}
                            disabled={isAddButtonDisabled}
                            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
                        >
                            ➕ Add Player to List
                        </button>

                        {/* Pending Players Preview */}
                        {players.length > 0 && (
                            <div className="mt-6 p-4 bg-teal-900/20 border border-teal-700 rounded-lg">
                                <p className="text-teal-300 text-sm font-semibold">
                                    ✓ {players.length} player{players.length !== 1 ? 's' : ''} ready to save
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - New Players to Add */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">📋</span> Pending Players ({players.length})
                        </h2>

                        {players.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-4xl mb-4">👥</p>
                                <p>No players added yet</p>
                                <p className="text-sm mt-2">Add players using the form on the left</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                {players.map((player, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-white">{player.name}</h3>
                                            <button
                                                onClick={() => removePlayer(index)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl transition-colors"
                                                title="Remove player"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="flex gap-4 text-sm">
                                            <span className="text-gray-300 bg-gray-600 px-3 py-1 rounded-full">
                                                📍 {player.position}
                                            </span>
                                            <span className="text-gray-300 bg-gray-600 px-3 py-1 rounded-full">
                                                #️⃣ {player.number}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Existing Players List */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 mt-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">⚽</span> Current Team Roster ({playersB.length})
                    </h2>

                    {playersB.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-4xl mb-4">🏃</p>
                            <p>No players in the team yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {playersB.map((player, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-teal-500 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-white mb-2 truncate" title={player.name}>
                                        {player.name}
                                    </h3>
                                    <div className="flex gap-2 text-sm flex-wrap">
                                        <span className="text-gray-300 bg-gray-600 px-2 py-1 rounded">
                                            📍 {player.position}
                                        </span>
                                        <span className="text-gray-300 bg-gray-600 px-2 py-1 rounded">
                                            #️⃣ {player.number}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePlayersPage