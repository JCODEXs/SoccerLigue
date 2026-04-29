
import { fetchPlayersByTeam, saveMatchData } from "@/app/actions/actions";
import React, { useEffect, useState } from "react";
import type { Event, Player, SavedMatchData, Match } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const FillResults: React.FC<{ match: Match; mode: 'live' | 'past' }> = ({ match, mode }) => {
  const { homeTeamId, awayTeamId, homeTeam, awayTeam,id,date,locationId, events: existingEvents } = match;
  const [selectedTeam, setSelectedTeam] = useState<string>(homeTeam?.name ?? "");
  const [otherTeam,setOtherTeam]=useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("goal");
  const [events, setEvents] = useState<Event[]>([]); // All events (existing + new)
  const [newEvents, setNewEvents] = useState<Event[]>([]); // Only new events to save
  const [manualTime, setManualTime] = useState<string>(''); // For past match mode
  const [hasExistingEvents, setHasExistingEvents] = useState<boolean>(false);
  const [existingEventsCount, setExistingEventsCount] = useState<number>(0);
  console.log(otherTeam,"otherteam")

  // Match start time tracking for live mode
  const [firstHalfStartTime, setFirstHalfStartTime] = useState<Date | null>(null);
  const [secondHalfStartTime, setSecondHalfStartTime] = useState<Date | null>(null);
  const [showTimeAdjustment, setShowTimeAdjustment] = useState<boolean>(false);

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

const makeOtherTeam = (team: string): string => {
  // Early returns for invalid inputs
  if (!team?.trim()) return '';
  if (!homeTeam?.name && !awayTeam?.name) return '';
  
  const trimmedTeam = team.trim();
  const homeName = homeTeam?.name || '';
  const awayName = awayTeam?.name || '';
  // console.log("teams other",homeName,homeTeam,awayName,trimmedTeam)
  
  // If one team is missing, return the other if it matches
  if (homeName && trimmedTeam === homeName) return awayName;
  if (awayName && trimmedTeam === awayName) return homeName;
  
  // Default fallback
  return awayName || homeName || '';
};

  // Helper function to convert any timestamp format to match minute
  // This function uses current state values, so it will recalculate when state changes
  const convertToMatchMinute = React.useCallback((timestamp: string): string => {
    if (timestamp.includes("'")) {
      return timestamp; // Already in match minute format
    }
  
    const matchStartTime = firstHalfStartTime ?? (match.date ? new Date(match.date) : null);
    if (!matchStartTime) {
      return timestamp;
    }
  
    try {
      let eventTime: Date;
  
      // Handle clock time (HH:MM:SS)
      if (timestamp.includes(':') && !timestamp.includes("'")) {
        const timeParts = timestamp.split(':');
        if (timeParts.length >= 2 && timeParts[0] && timeParts[1]) {
          // Use the match date but with the event time
          const matchDateStr = matchStartTime.toISOString().split('T')[0];
          const timeStr = timestamp.padStart(8, '0').substring(0, 8); // Ensure HH:MM:SS format
          const eventDateTime = `${matchDateStr}T${timeStr}`;
          eventTime = new Date(eventDateTime);
          
          // console.log('Time conversion:', {
          //   matchDateStr,
          //   timeStr,
          //   eventDateTime,
          //   eventTime: eventTime?.toISOString()
          // });
  
          if (isNaN(eventTime.getTime())) {
            // console.warn('Invalid event time:', timestamp);
            return timestamp;
          }
        } else {
          return timestamp;
        }
      }
      // Handle other formats (fallback)
      else {
        return timestamp;
      }
  
      // Calculate difference
      const diffMs = eventTime.getTime() - matchStartTime.getTime();
      const matchMinute = Math.floor(diffMs / 60000);
  
      // console.log('Time difference calculation:', {
      //   matchStart: matchStartTime.toISOString(),
      //   eventTime: eventTime.toISOString(),
      //   diffMs,
      //   matchMinute,
      //   diffHours: (diffMs / 3600000).toFixed(2)
      // });
  
      if (matchMinute < 0) {
        console.warn('Event before match start:', matchMinute);
        return `PRE${Math.abs(matchMinute)}'`;
      }
  
      // Your existing half-time logic here...
      if (secondHalfStartTime && eventTime >= secondHalfStartTime) {
        const secondHalfDiffMs = eventTime.getTime() - secondHalfStartTime.getTime();
        const secondHalfMinute = Math.floor(secondHalfDiffMs / 60000);
        
        const firstHalfDurationMs = secondHalfStartTime.getTime() - matchStartTime.getTime();
        const firstHalfMinutes = Math.floor(firstHalfDurationMs / 60000);
        
        const totalMinute = firstHalfMinutes + secondHalfMinute;
  
        if (secondHalfMinute > 45) {
          const injuryTime = secondHalfMinute - 45;
          return `90+${injuryTime}'`;
        }
        
        return `${totalMinute}'`;
      }
      else if (matchMinute > 45) {
        const injuryTime = matchMinute - 45;
        return `45+${injuryTime}'`;
      }
  
      return `${matchMinute}'`;
  
    } catch (error) {
      console.error("Conversion error:", error, "Timestamp:", timestamp);
      return timestamp;
    }
  }, [firstHalfStartTime, secondHalfStartTime, match.date]); // Re-create when these change

  // Wrapper for backward compatibility
  const calculateMatchMinute = convertToMatchMinute;

  // custom functions
const handleSave = async () => {
  try {
    if (!id || !homeTeam?.name || !awayTeam?.name || !events?.length) {
      console.error("Missing required match data", { id, homeTeam, awayTeam, events });
      toast("Error: Missing required match data.");
      return;
    }

    const matchData: SavedMatchData = {
      events: newEvents,
      matchId: id,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
    };

    console.log("Saving match data:", matchData);

    const response = await saveMatchData({ matchData });

    if (response?.success) {
      toast("Match saved successfully!");
       router.push("/view-results"+`/${id}`);
    } else {
      console.error("Error saving match:", response);
      toast(`Error saving match: ${response?.message ?? "Unknown error"}`);
    }
  } catch (error) {
    console.error("Unexpected error saving match:", error);
    toast("An unexpected error occurred while saving the match.");
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
  

  // Load existing events if they exist
  useEffect(() => {
    if (existingEvents && existingEvents.length > 0 && !hasExistingEvents) {
      console.log("Loading existing events:", existingEvents);
      // Convert existing events to the Event format
      // Note: We store original timestamps, conversion happens on display
      const formattedEvents: Event[] = existingEvents
        .filter((event) => event.team) // Only include events with a team
        .map((event) => ({
          type: event.type,
          team: event.team!,
          player: event.player,
          assistant: event.assistant ?? undefined,
          card: event.card ?? undefined,
          substitute: event.substitute ?? undefined,
          timestamp: event.timestamp, // Keep original timestamp for conversion on display
        }));
      setEvents(formattedEvents);
      setExistingEventsCount(formattedEvents.length); // Track how many events already exist
      setHasExistingEvents(true);
      toast.success(`Loaded ${formattedEvents.length} existing event${formattedEvents.length > 1 ? 's' : ''}`);
    }
  }, [existingEvents, hasExistingEvents]);

  useEffect(() => {
    void getPlayersData();
  }, []);

  useEffect(() => {
    if (selectedEvent != "goal" && selectedEvent!="penalty") {
  setGoalAssistant(selectedPlayer);}
}, [selectedPlayer,selectedEvent]);


  const handleAddEvent = () => {
    if (!selectedPlayer) return;

    // Determine timestamp based on mode
    let timestamp: string
    if (mode === 'live') {
      // Live mode: check if match start time is set
      if (!firstHalfStartTime) {
        toast.error("Please set the match start time first");
        return;
      }
      // Use current time and calculate match minute
      const now = new Date();
      timestamp = now.toTimeString().split(' ')[0] ?? new Date().toISOString();
      // timestamp = calculateMatchMinute(currentTime);
    } else {
      // Past match mode: use manual time input
      if (!manualTime.trim()) {
        toast.error("Please enter the match minute for this event");
        return;
      }
      timestamp = manualTime;
    }

    // Add the corner/free kick event
    const newEvent: Event = {
      type: selectedEvent,
      team:selectedTeam,
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
        team:  selectedEvent=="penalty"?otherTeam:selectedTeam,
        player: goalScorer,
        assistant: goalAssistant ?? undefined,
        timestamp,
      };
      // console.log("events",newEvent,goalEvent)
      setEvents([...events, newEvent, goalEvent]);
      setNewEvents([...newEvents, newEvent, goalEvent]); // Track new events separately
    } else {
      setEvents([...events, newEvent]);
      setNewEvents([...newEvents, newEvent]); // Track new events separately
    }
updateAvailablePlayers(newEvent);
    // Reset states
    setIsGoalFromEvent(false);
    setGoalScorer("");
    setManualTime(""); // Reset manual time
    // setCard(null);
    // setSelectedEvent("");
    // setSelectedTeam("");
    setSelectedPlayer(null);
    setGoalAssistant("");
  };

  const handleRemoveEvent = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    toast.success("Event removed");
  };
const updateAvailablePlayers = (event: Event) => {
  const { type, player, team, card, substitute } = event;

  // console.log("playersB", availablePlayersB);
  // console.log("playersA", availablePlayersA);
  // console.log("SubplayersA", substitutePlayersA);
  // console.log("SubplayersB", substitutePlayersB);

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
  // console.log(events)
};

  return (
    <div className="p-1">

      <div className="p-1 bg-gray-800 rounded-lg shadow-md w-full max-w-2xl mx-auto text-white">
        {/* Existing Events Indicator */}
        {hasExistingEvents && (
          <div className="mb-4 p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="text-blue-300 font-semibold">Existing Events Loaded</p>
                <p className="text-blue-400 text-sm">
                  This match already has {events.length} event{events.length > 1 ? 's' : ''}. You can add more or save to update.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Match Time Adjustment - Only for Live Mode */}
        {mode === 'live' && (
          <div className="mb-4 p-4 bg-teal-900/30 border border-teal-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <h3 className="text-teal-300 font-semibold">Match Time Settings</h3>
              </div>
              <button
                onClick={() => setShowTimeAdjustment(!showTimeAdjustment)}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                {showTimeAdjustment ? '▼ Hide' : '▶ Show'}
              </button>
            </div>

            {showTimeAdjustment && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Half Start Time */}
                  <div>
                    <label className="block text-sm font-semibold text-teal-300 mb-2">
                      First Half Start Time {!firstHalfStartTime && <span className="text-red-400">*</span>}
                    </label>
                    <div className="flex gap-2">
                    <input
  type="time"
  step="1"
  value={firstHalfStartTime ? firstHalfStartTime.toTimeString().slice(0, 8) : ''}
  onChange={(e) => {
    if (e.target.value) {
      const [hours, minutes, seconds] = e.target.value.split(':');
      
      // Create a new date using the match date (if available) or today's date
      const baseDate = match.date ? new Date(match.date) : new Date();
      
      const newTime = new Date(baseDate);
      newTime.setHours(parseInt(hours ?? '0'));
      newTime.setMinutes(parseInt(minutes ?? '0'));
      newTime.setSeconds(parseInt(seconds ?? '0'));
      
      // console.log('Setting first half start time:', {
      //   inputValue: e.target.value,
      //   baseDate: baseDate.toISOString(),
      //   newTime: newTime.toISOString(),
      //   localTime: newTime.toLocaleString()
      // });
      
      setFirstHalfStartTime(newTime);
    }
  }}
  className="flex-1 px-3 py-2 bg-gray-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
/>
                      <button
                        onClick={() => setFirstHalfStartTime(new Date())}
                        className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm transition-colors"
                      >
                        Now
                      </button>
                    </div>
                    {firstHalfStartTime && (
                      <p className="text-xs text-teal-400 mt-1">
                        Set to: {firstHalfStartTime.toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  {/* Second Half Start Time */}
                  <div>
                    <label className="block text-sm font-semibold text-teal-300 mb-2">
                      Second Half Start Time (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        step="1"
                        value={secondHalfStartTime ? secondHalfStartTime.toTimeString().slice(0, 8) : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            const [hours, minutes, seconds] = e.target.value.split(':');
                            const newTime = new Date();
                            newTime.setHours(parseInt(hours ?? '0'));
                            newTime.setMinutes(parseInt(minutes ?? '0'));
                            newTime.setSeconds(parseInt(seconds ?? '0'));
                            setSecondHalfStartTime(newTime);
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        onClick={() => setSecondHalfStartTime(new Date())}
                        className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm transition-colors"
                      >
                        Now
                      </button>
                    </div>
                    {secondHalfStartTime && (
                      <p className="text-xs text-teal-400 mt-1">
                        Set to: {secondHalfStartTime.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-teal-950/50 rounded-lg">
                  <p className="text-xs text-teal-300">
                    💡 <strong>Tip:</strong> Set the first half start time when the match begins.
                    Set the second half start time when the second half begins for accurate minute calculation.
                    Events will be recorded as match minutes (e.g., 23, 45+2, 67).
                  </p>
                </div>
              </div>
            )}

            {/* Reference Time Indicator */}
            {!showTimeAdjustment && (
              <div className="mt-3 p-2 bg-teal-950/30 rounded-lg">
                <p className="text-xs text-teal-400">
                  {firstHalfStartTime ? (
                    <>
                      ✓ Using adjusted start time: <strong>{firstHalfStartTime.toLocaleTimeString()}</strong>
                      {secondHalfStartTime && (
                        <> | Second half: <strong>{secondHalfStartTime.toLocaleTimeString()}</strong></>
                      )}
                    </>
                  ) : match.date ? (
                    <>
                      ℹ️ Using planned match time: <strong>{new Date(match.date).toLocaleTimeString()}</strong>
                      <span className="text-yellow-400"> (Set adjusted time for accuracy)</span>
                    </>
                  ) : (
                    <span className="text-red-400">⚠️ No reference time available</span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-bold text-orange-500 flex-grow-1 w-1/2 p-2">Manage Match Events</h2>
           <button
            className="m-2 bg-teal-600 text-white text-lg p-2 rounded border-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
            onClick={handleSave}
            disabled={events.length === 0}
          >
            {hasExistingEvents ? 'Update Match' : 'Save Match'}
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
              setOtherTeam(makeOtherTeam(e.target.value))
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
                value={goalScorer ?? ""}
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
                value={goalScorer ?? ""}
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

        {/* Manual Time Input - Only for Past Match Mode */}
        {mode === 'past' && (
          <div className="mt-4 p-4 bg-orange-900/20 border border-orange-600 rounded-lg">
            <label className="block font-semibold text-orange-300 mb-2">
              Match Minute <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              placeholder="e.g., 23, 45+2, 67"
              className="border p-3 rounded w-full bg-gray-700 border-orange-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-orange-300 mt-2">
              💡 Enter the minute when this event occurred (e.g., 23 for 23rd minute, 45+2 for injury time)
            </p>
          </div>
        )}

        {/* Live Mode Indicator */}
        {mode === 'live' && (
          <div className="mt-4 p-3 bg-teal-900/20 border border-teal-600 rounded-lg flex items-center gap-2">
            <span className="text-2xl animate-pulse">🔴</span>
            <p className="text-sm text-teal-300">
              <span className="font-semibold">Live Mode:</span> Events will be timestamped automatically
            </p>
          </div>
        )}

        {/* Add Event Button */}
        <button
          className="mt-3 bg-teal-700 text-white py-2 my-2 rounded w-full hover:bg-teal-600 transition-colors font-semibold"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        
        {/* Events List */}
        <div className="mt-3 rounded-lg shadow-lg w-full">
          <h3 className="text-xl font-bold text-teal-900 text-center bg-orange-300 py-2 rounded-t-lg">
            Match Events ({events.length})
          </h3>
          {events.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 rounded-b-lg">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-400 italic">No events added yet.</p>
            </div>
          ) : (
            <ul className="mt-1 space-y-2">
              {events.map((event, index) => {
                // Convert timestamp to match minute for display
                const displayTime = convertToMatchMinute(event.timestamp);

                // Debug log
                if (index === 0) {
                  // console.log('Time conversion:', {
                  //   original: event.timestamp,
                  //   converted: displayTime,
                  //   firstHalfStart: firstHalfStartTime?.toLocaleTimeString(),
                  //   secondHalfStart: secondHalfStartTime?.toLocaleTimeString(),
                  //   matchDate: match.date
                  // });
                }

                return (
                  <li
                    key={index}
                    className="grid grid-cols-5 bg-gray-800 items-center rounded-md shadow transition hover:bg-gray-900 p-2"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-red-400 font-bold text-sm">{event.type}</span>
                      {event.assistant && event.type==="goal" && (
                        <span className="text-gray-400 italic text-xs">(Assist: {event.assistant})</span>
                      )}
                      {event.card && event.type==="faul" &&(
                        <span className="text-gray-400 italic text-xs">({event.card})</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-blue-400 text-sm">{event.player}</span>
                      {event.type==="substitution" && (
                        <span className="text-teal-600 text-xs">→ {event.substitute}</span>
                      )}
                    </div>
                    <span className="text-gray-300 text-sm text-center">{event.team}</span>
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-semibold text-teal-600 text-lg text-center">{displayTime}</span>
                      {event.timestamp !== displayTime && (
                        <span className="text-xs text-gray-500" title={`Original: ${event.timestamp}`}>
                          {/* (converted) */}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleRemoveEvent(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl transition-colors"
                        title="Remove event"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FillResults;