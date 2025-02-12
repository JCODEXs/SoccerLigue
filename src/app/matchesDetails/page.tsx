"use client"
import Details from "@/components/Details";
import FillResults from "@/components/fillResults";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const MatchDetails = () => {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
   const [match, setMatch] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isReadyForResults, setIsReadyForResults] = useState(false);
  const [isResultsAvailable, setIsResultsAvailable] = useState(false);

  useEffect(() => {
    if (dataParam) {
      try {
        const matchData = JSON.parse(decodeURIComponent(dataParam));
        setMatch(matchData);

        const matchDate = new Date(matchData.date); // Match start time
        const matchCreation = new Date(matchData.createdAt); // When the match was created
        const currentDate = new Date()
        const twoHoursAfterMatch = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after start
        const matchDuration = 105 * 60 * 1000; // 90 minutes in milliseconds
        const matchEndTime = new Date(matchDate.getTime() + matchDuration); // Match end time
       

        console.log("Current date:", currentDate);
        console.log("Match date:", matchDate);
        console.log("Match end time:", matchEndTime);
        console.log("Two hours after match:", twoHoursAfterMatch);

        // Check if the match is editable
        setIsEditable(currentDate > matchCreation && currentDate < twoHoursAfterMatch);

        // Check if the match has ended
        setIsReadyForResults(currentDate > matchDate);

        // Check if results are available (assuming `matchData.results` exists)
        // setIsResultsAvailable(matchData.results && matchData.results.length > 0);
      } catch (error) {
        console.error("Error decoding match data:", error);
      }
    }
  }, [dataParam]);

// If the match is editable, show the Details component
  if (isEditable) {
    return 
     <div className="pb-2">
       <Details match={match} />;
      </div>
  }

  // If the match has ended and results are not available, show the FillResults component
  if (isReadyForResults ) {
    return (
      <div className="pb-2">
      <FillResults match={match} />;
      </div>
    )
  }

  // If the results are available, show a link to the results page
  if (isResultsAvailable) {
    return (
      <div>
        <p className="text-green-500">Results are available. View the scoreboard:</p>
        <a href={`/matchesDetails/${match.id}/results`} className="text-blue-700 underline">View Results</a>
      </div>
    );
  }

  // Default case (just in case)
  return <p className="text-white text-3xl items-center justify-center flex pt-6 font-bold">Match status is being processed...</p>;

}
export default MatchDetails;
