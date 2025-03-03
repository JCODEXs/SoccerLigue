
import { fetchPlayersByTeam, saveMatchData } from "@/app/actions/actions";
import React, { useEffect, useState } from "react";
import type { Event, Player, SavedMatchData, Match } from "@/lib/types";
import { useRouter } from "next/navigation";


const FillResults: React.FC<{ match: Match }> = ({ match }) => {
  console.log(match)
  const { homeTeamId, awayTeamId, homeTeam, awayTeam,id,date,locationId } = match;
  const [selectedTeam, setSelectedTeam] = useState<string>(homeTeam?.name ?? "");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("goal");
  const [events, setEvents] = useState<Event[]>([]);
  // const [playersA, setPlayersA] = useState<[]>([]);
  // const [playersB, setPlayersB] = useState<[]>([]);
  const [isGoalFromEvent, setIsGoalFromEvent] = useState<boolean>(false); 
  const [goalScorer, setGoalScorer] = useState<string >(""); // 
  const [goalAssistant, setGoalAssistant] = useState<string| null >(null);
  const [availablePlayersA, setAvailablePlayersA] = useState<Player[]>([]); 
  const [availablePlayersB, setAvailablePlayersB] = useState<Player[]|[]>([]); 
  const [substitutePlayersA, setSubstitutePlayersA] = useState<Player[]|[]>([]); 
  const [substitutePlayersB, setSubstitutePlayersB] = useState<Player[]|[]>([]); 
  const [substitutePlayer, setSubstitutePlayer] = useState<string | null>(null); 
  const router=useRouter();
  // custom functions
const handleSave = async () => {
  try {
    if (!id || !homeTeam?.name || !awayTeam?.name || !events?.length) {
      console.error("Missing required match data", { id, homeTeam, awayTeam, events });
      alert("Error: Missing required match data.");
      return;
    }

    const matchData: SavedMatchData = {
      events,
      matchId: id,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
    };

    console.log("Saving match data:", matchData);

    const response = await saveMatchData({ matchData });

    if (response?.success) {
      alert("Match saved successfully!");
       router.push("/view-results"+`/${id}`);
    } else {
      console.error("Error saving match:", response);
      alert(`Error saving match: ${response?.message ?? "Unknown error"}`);
    }
  } catch (error) {
    console.error("Unexpected error saving match:", error);
    alert("An unexpected error occurred while saving the match.");
  }
};


  const getPlayersData = async () => {
    const playersa = homeTeam&&await fetchPlayersByTeam(homeTeam?.name);
    const playersb =awayTeam&& await fetchPlayersByTeam(awayTeam.name);
if(playersa && playersb){

  setAvailablePlayersA(playersa.players.slice(0,11)); // Initialize available players for Team A
  setAvailablePlayersB(playersb.players.slice(0,11)); // Initialize available players for Team B
  setSubstitutePlayersA(playersa.players.slice(11))
  setSubstitutePlayersB(playersb.players.slice(11))
}
    console.log("Home Team Players:", playersa?.players);
    console.log("Away Team Players:", playersb?.players);
  };
  

  useEffect(() => {
    void getPlayersData();
  }, []);
  useEffect(() => {
    if (selectedEvent != "goal" && selectedEvent!="penalty") {
  setGoalAssistant(selectedPlayer);}
}, [selectedPlayer,selectedEvent]); 


  const handleAddEvent = () => {
    if (!selectedPlayer) return;

    const timestamp = new Date().toLocaleTimeString();

    // Add the corner/free kick event
    const newEvent: Event = {
      type: selectedEvent,
      team: selectedTeam,
      player: selectedPlayer,
      assistant: goalAssistant ??undefined,
      card: card ?? undefined,
      substitute:substitutePlayer ??undefined,
      timestamp,
    };

    // If the corner/free kick resulted in a goal, add a goal event
    if (isGoalFromEvent && goalScorer) {
      const goalEvent: Event = {
        type: "goal",
        team: selectedTeam,
        player: goalScorer,
        assistant: goalAssistant ?? undefined,
        timestamp,
      };
      console.log("events",newEvent,goalEvent)
      setEvents([...events, newEvent, goalEvent]);
    } else {
      setEvents([...events, newEvent]);
    }
updateAvailablePlayers(newEvent);
    // Reset states
    setIsGoalFromEvent(false);
    setGoalScorer("");
    // setCard(null);
    // setSelectedEvent("");
    // setSelectedTeam("");
    setSelectedPlayer(null);
    setGoalAssistant("");
  };
const updateAvailablePlayers = (event: Event) => {
  const { type, player, team, card, substitute } = event;

  console.log("playersB", availablePlayersB);
  console.log("playersA", availablePlayersA);
  console.log("SubplayersA", substitutePlayersA);
  console.log("SubplayersB", substitutePlayersB);

  if (team === homeTeam?.name) {
    let updatedPlayersA = [...availablePlayersA];

    if (type === "faul" && card === "Red Card") {
      // Permanently remove the player if they receive a red card
      updatedPlayersA = updatedPlayersA.filter((p) => p.name !== player);
      setSelectedPlayer(null); // Reset selected player
    } else if (type === "faul" && card === "Yellow Card") {
      // Check if the player has two yellow cards
      const yellowCardCount = events.filter(
        (e) => e.player === player && e.card === "Yellow Card"
      ).length;
      if (yellowCardCount >= 1) {
        // Permanently remove the player if they have two yellow cards
        updatedPlayersA = updatedPlayersA.filter((p) => p.name !== player);
        setSelectedPlayer(null); // Reset selected player
      }
    } else if (type === "substitution" && substitute) {
      // Replace the player with the substitute
      updatedPlayersA = updatedPlayersA.map((p) =>
        p.name === player ? substitutePlayersA.find((sub) => sub.name === substitute)! : p
      );

      // Remove the substitute from the substitutes list
      const updatedSubstitutesA = substitutePlayersA.filter((sub) => sub.name !== substitute);
      setSubstitutePlayersA(updatedSubstitutesA);
    }

    // Update the available players list for Team A
    setAvailablePlayersA(updatedPlayersA);
  } else if (team === awayTeam?.name) {
    let updatedPlayersB = [...availablePlayersB];

    if (type === "faul" && card === "Red Card") {
      // Permanently remove the player if they receive a red card
      updatedPlayersB = updatedPlayersB.filter((p) => p.name !== player);
      setSelectedPlayer(null); // Reset selected player
    } else if (type === "faul" && card === "Yellow Card") {
      // Check if the player has two yellow cards
      const yellowCardCount = events.filter(
        (e) => e.player === player && e.card === "Yellow Card"
      ).length;
      if (yellowCardCount >= 1) {
        // Permanently remove the player if they have two yellow cards
        updatedPlayersB = updatedPlayersB.filter((p) => p.name !== player);
        setSelectedPlayer(null); // Reset selected player
      }
    } else if (type === "substitution" && substitute) {
      // Replace the player with the substitute
      updatedPlayersB = updatedPlayersB.map((p) =>
        p.name === player ? substitutePlayersB.find((sub) => sub.name === substitute)! : p
      );

      // Remove the substitute from the substitutes list
      const updatedSubstitutesB = substitutePlayersB.filter((sub) => sub.name !== substitute);
      setSubstitutePlayersB(updatedSubstitutesB);
    }

    // Update the available players list for Team B
    setAvailablePlayersB(updatedPlayersB);
  }
  console.log(events)
};

  return (
    <div className="p-1">
     
      <div className="p-1 bg-gray-800 rounded-lg shadow-md w-full max-w-2xl mx-auto text-white">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-bold text-orange-500 flex-grow-1 w-1/2 p-2">Manage Match Events</h2>  
           <button
            className="m-2 bg-teal-600 text-white text-lg p-2 rounded border-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed "
            onClick={handleSave}
            disabled={events.length === 0}
          >
            Save match
          </button>
        </div>
        {/* Team Selection */}
        <div className="mt-4">
          <label className="block font-semibold">Select Team</label>
          <select
            className="border p-2 rounded w-full bg-gray-600 border-teal-800"
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(e.target.value);
              setSelectedPlayer(null); // Reset player when team changes
            }}
          >
            <option value={`${homeTeam?.name}`}>{homeTeam?.name}</option>
            <option value={`${awayTeam?.name}`}>{awayTeam?.name}</option>
          </select>
        </div>
         {/* Event Type Selection */}
        <div className="mt-4">
          <label className="block font-semibold">Select Event</label>
          <select
            className="border p-2 rounded w-full bg-gray-600 border-teal-800"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="goal">Goal</option>
            <option value="faul">Faul</option>
            {/* <option value="yellow card">Yellow Card</option>
            <option value="red card">Red Card</option> */}
            <option value="free kick">Free Kick</option>
            <option value="penalty">Penalty</option>
            <option value="corner kick">Corner Kick</option>
            <option value="substitution">Substitution</option>
          </select>
        </div>
        {/* Player Selection */}
        <div className="mt-4">
          <label className="block font-semibold">Select Player</label>
          <select
            className="border p-2 rounded w-full bg-gray-600 border-teal-800"
            value={selectedPlayer ?? ""}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            <option value="" disabled>Select a player</option>
            {(Array.isArray(selectedTeam === homeTeam?.name ? availablePlayersA : availablePlayersB)
              ? selectedTeam === homeTeam?.name
              ? availablePlayersA
              : availablePlayersB
              : []
            ).map((player) => (
              <option key={player.id} value={`${player.name}`}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      
          {/* Assistant Selection (Only for Goals) */}
         {selectedEvent === "goal" && (
           <div className="mt-4">
             <label className="block font-semibold">Assist Player (optional)</label>
             <select
               className="border p-2 rounded w-full bg-gray-600 border-teal-800"
               value={goalAssistant ?? ""}
               onChange={(e) => setGoalAssistant(e.target.value)}
             >
               <option value="">No Assist</option>
               {(Array.isArray(selectedTeam === homeTeam?.name ? availablePlayersA : availablePlayersB)
         ? selectedTeam === homeTeam?.name
           ?  availablePlayersA.filter((player) => player.name !== selectedPlayer)
                    : availablePlayersB.filter((player) => player.name !== selectedPlayer)
         : []
       ).map((player) => (
                 <option key={player.id} value={`${player.name}`}>
                 {/* <option key={player.id} value={`${player.name}-${player.id}`}> */}
                   {player.name}
                 </option>
               ))}
             </select>
           </div>
         )}
         {selectedEvent === "faul" && (
           <div className="mt-4">
             <label className="block font-semibold">Card</label>
             <select
               className="border p-2 rounded w-full bg-gray-600 border-teal-800"
               value={card ?? ""}
               onChange={(e) => setCard(e.target.value)}
             >
               <option value="">No Card</option>
              <option value="Yellow Card">Yellow Card</option>
              <option value="Red Card">Red Card</option>
             </select>
           </div>
         )}
        {/* Goal from Corner/Free Kick Section */}
        {(selectedEvent === "corner kick" || selectedEvent === "free kick" || selectedEvent === "penalty") && (
          <div className="mt-4">
            <label className="block font-semibold">Did it result in a goal?</label>
            <select
              className="border p-2 rounded w-full bg-gray-600 border-teal-800"
              value={isGoalFromEvent ? "yes" : "no"}
              onChange={(e) => setIsGoalFromEvent(e.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        )}
        {/* Goal Scorer and Assistant Selection (if goal from corner/free kick) */}
        {isGoalFromEvent && selectedEvent!="penalty" && (
          <>
            <div className="mt-4">
              <label className="block font-semibold">Goal Scorer</label>
              <select
                className="border p-2 rounded w-full bg-gray-600 border-teal-800"
                value={goalScorer || ""}
                onChange={(e) => setGoalScorer(e.target.value)}
              >
                <option value="" disabled>Select a goal scorer</option>
                {(Array.isArray(selectedTeam === homeTeam?.name ? availablePlayersA : availablePlayersB)
                  ? selectedTeam === homeTeam?.name
                    ? availablePlayersA
                    : availablePlayersB
                  : []
                ).map((player) => (
                  <option key={player.id} value={`${player.name}`}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block font-semibold">Assist Player (optional)</label>
              <select
                className="border p-2 rounded w-full bg-gray-600 border-teal-800"
                value={goalAssistant ?? selectedPlayer??""}
                onChange={(e) => setGoalAssistant(e.target.value)}
              >
      
                <option value="">No Assist</option>
                {(Array.isArray(selectedTeam === homeTeam?.name ? availablePlayersA : availablePlayersB)
                    ? selectedTeam === homeTeam?.name
                    ?  availablePlayersA.filter((player) => player.name !== goalScorer)
                    : availablePlayersB.filter((player) => player.name !== goalScorer)
                  : []
                ).map((player) => (
                  <option key={player.id} value={`${player.name}`}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        {isGoalFromEvent && selectedEvent==="penalty" && (
          <>
            <div className="mt-4">
              <label className="block font-semibold">Goal Scorer</label>
              <select
                className="border p-2 rounded w-full bg-gray-600 border-teal-800"
                value={goalScorer || ""}
                onChange={(e) => setGoalScorer(e.target.value)}
              >
                <option value="" disabled>Select a goal scorer</option>
                {(Array.isArray(selectedTeam === homeTeam?.name ? availablePlayersA : availablePlayersB)
                  ? selectedTeam === homeTeam?.name
                  ? availablePlayersB
                  : availablePlayersA
                  : []
                ).map((player) => (
                  <option key={player.id} value={`${player.name}`}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
      
          </>
        )}
        { selectedEvent==="substitution" && (
          <>
          <div className="mt-4">
  <label className="block font-semibold">Select Substitute</label>
  <select
    className="border p-2 rounded w-full bg-gray-600 border-teal-800"
    value={substitutePlayer ?? ""}
    onChange={(e) => setSubstitutePlayer(e.target.value)}
  >
    <option value="" disabled>Select a substitute</option>
    {(Array.isArray(selectedTeam === homeTeam?.name ? substitutePlayersA : substitutePlayersB)
                  ? selectedTeam === homeTeam?.name
                  ? substitutePlayersA
                  : substitutePlayersB
                  : []
                ).map((p) => (
      <option key={p.id} value={p.name}>{p.name}</option>
    ))}
  </select>
</div>

          </>
        )}
        {/* Add Event Button */}
        <button
          className="mt-3 bg-teal-700 text-white py-2 my-2 rounded w-full"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        
        {/* Events List */}
        <div className="mt-3   rounded-lg shadow-lg  w-full">
          <h3 className="text-xl font-bold text-teal-900 text-center bg-orange-300">Match Events</h3>
          {events.length === 0 ? (
            <p className="text-gray-400 italic mt-2">No events added yet.</p>
          ) : (
            <ul className="mt-1 space-y-2">
              {events.map((event, index) => (
                <li
                  key={index}
                  className="grid grid-cols-4 bg-gray-800  items-center rounded-md shadow transition hover:bg-gray-900"
                >
                  <div className="flex flex-col items-center justify-end">
                    <span className="text-red-400 font-bold ">{event.type}</span>
                    {event.assistant && event.type==="goal" && (
                      <span className="text-gray-400 italic text-sm">(Assist: {event.assistant})</span>
                    )}
                    {event.card && event.type==="faul" &&(
                      <span className="text-gray-400 italic text-sm">( {event.card})</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-end">
                     <span className="text-blue-400 font-sm">{event.player}</span>
                  {event.type==="substitution" && <span className="text-teal-600 font-sm">{event.substitute}</span>}
                    </div>
                  <span className="text-gray-300 font-sm">{event.team}</span>
                      <span className="font-semibold text-teal-600">{event.timestamp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FillResults;