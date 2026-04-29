"use client"
import { findMatch } from "@/app/actions/actions";
import Details from "@/components/Details";
import FillResults from "@/components/fillResults";
import type { Match } from "@/lib/types";
import { use, useEffect, useState } from "react";


const  MatchDetails= ({ params,
}: {
  params: Promise<{ slug: string }>
}) =>{

  const [match, setMatch] = useState<Match |null >(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isReadyForResults, setIsReadyForResults] = useState(false);
  const [isResultsAvailable, setIsResultsAvailable] = useState(false);
  const [annotationMode, setAnnotationMode] = useState<'live' | 'past' | null>(null);

const { slug } = use(params);
  console.log(slug)
 

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
         if (!slug) return;
        const matchDataP:Match|null = await findMatch(slug);
        console.log("este",matchDataP)
        if (!matchDataP){
          return;
        }
          setMatch(matchDataP);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    void fetchMatchData();
  }, [slug]);
  useEffect(() => {
    if (match) {
      try {
        

        const matchDate = new Date(match?.date); // Match start time
        const matchCreation = new Date(match?.createdAt); // When the match was created
        const currentDate = new Date()
        const twoHoursAfterMatch = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after start
        const matchDuration = 105 * 60 * 1000; // 90 minutes in milliseconds
        const matchEndTime = new Date(matchDate.getTime() + matchDuration); // Match end time
       

        console.log("Current date:", currentDate);
        console.log("Match date:", matchDate);
        console.log("Match end time:", matchEndTime);
        console.log("Two hours after match:", twoHoursAfterMatch);

        // Check if the match is editable
        setIsReadyForResults(currentDate > matchDate);
        setIsEditable(currentDate > matchCreation && currentDate < twoHoursAfterMatch&&!isReadyForResults);

        // Check if the match has ended

        // Check if results are available (assuming `matchData.results` exists)
        // setIsResultsAvailable(matchData.results && matchData.results.length > 0);
      } catch (error) {
        console.error("Error decoding match data:", error);
      }
    }
  }, [match,isReadyForResults]);

// If the match is editable, show the Details component
  if (isEditable&&match) {
    return (
     <div className="pb-2">
       <Details match={match} />;
      </div>)
  }

  // If the match has ended and results are not available, show mode selection or FillResults
  if (isReadyForResults && match) {
    // If no mode is selected, show the mode selection interface
    if (!annotationMode) {
      return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Match Header */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-400 mb-4">
                {match?.homeTeam?.name} vs {match?.awayTeam?.name}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-gray-300">
                <p className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span>{match?.location?.name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <span>{new Date(match?.date).toLocaleDateString()}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">🕐</span>
                  <span>{match?.time}</span>
                </p>
              </div>
            </div>

            {/* Mode Selection Interface */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Select Annotation Mode
                </h2>
                <p className="text-gray-400 text-lg">
                  Choose how you want to track this match
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Live Match Mode */}
                <button
                  onClick={() => setAnnotationMode('live')}
                  className="group relative bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 rounded-xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-105"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-7xl animate-pulse">🔴</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">Live Match</h3>
                    <p className="text-teal-100 text-base text-center leading-relaxed">
                      Track events in real-time as they happen during the match
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-teal-200">
                        <span className="text-lg">⏱️</span>
                        <span className="text-sm font-semibold">Auto timestamp</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-200">
                        <span className="text-lg">⚡</span>
                        <span className="text-sm font-semibold">Real-time tracking</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-3 border-transparent group-hover:border-teal-300 rounded-xl transition-colors"></div>
                </button>

                {/* Annotate Past Match Mode */}
                <button
                  onClick={() => setAnnotationMode('past')}
                  className="group relative bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-7xl">📝</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">Annotate Past Match</h3>
                    <p className="text-orange-100 text-base text-center leading-relaxed">
                      Add events to a completed match with manual time entry
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-orange-200">
                        <span className="text-lg">🕐</span>
                        <span className="text-sm font-semibold">Manual timestamp</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-200">
                        <span className="text-lg">📊</span>
                        <span className="text-sm font-semibold">Historical data entry</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-3 border-transparent group-hover:border-orange-300 rounded-xl transition-colors"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If mode is selected, show FillResults with the selected mode
    return (
      <div className="pb-2">
        {/* Mode Indicator Bar */}
        <div className="bg-gray-800 p-4 mb-2 mx-4 rounded-lg shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{annotationMode === 'live' ? '🔴' : '📝'}</span>
              <div>
                <p className="text-sm text-gray-400">Current Mode</p>
                <p className="text-xl font-bold text-white">
                  {annotationMode === 'live' ? 'Live Match Tracking' : 'Past Match Annotation'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAnnotationMode(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-semibold"
            >
              Change Mode
            </button>
          </div>
        </div>
        <FillResults match={match} mode={annotationMode} />
      </div>
    );
  }

  // If the results are available, show a link to the results page
  if (isResultsAvailable) {
    return (
      <div>
        <p className="text-green-500">Results are available. View the scoreboard:</p>
        <a href={`/matchesDetails/${match?.id}/results`} className="text-blue-700 underline">View Results</a>
      </div>
    );
  }

  // Default case (just in case)
  return <p className="text-white text-3xl items-center justify-center flex pt-6 font-bold">Match status is being processed...</p>;

}
export default MatchDetails;
