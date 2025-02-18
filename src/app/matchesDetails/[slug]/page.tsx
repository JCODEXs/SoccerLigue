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
        setIsEditable(currentDate > matchCreation && currentDate < twoHoursAfterMatch);

        // Check if the match has ended
        setIsReadyForResults(currentDate > matchDate);

        // Check if results are available (assuming `matchData.results` exists)
        // setIsResultsAvailable(matchData.results && matchData.results.length > 0);
      } catch (error) {
        console.error("Error decoding match data:", error);
      }
    }
  }, [match]);

// If the match is editable, show the Details component
  if (isEditable&&match) {
    return (
     <div className="pb-2">
       <Details match={match} />;
      </div>)
  }

  // If the match has ended and results are not available, show the FillResults component
  if (isReadyForResults&& match ) {
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
        <a href={`/matchesDetails/${match?.id}/results`} className="text-blue-700 underline">View Results</a>
      </div>
    );
  }

  // Default case (just in case)
  return <p className="text-white text-3xl items-center justify-center flex pt-6 font-bold">Match status is being processed...</p>;

}
export default MatchDetails;
