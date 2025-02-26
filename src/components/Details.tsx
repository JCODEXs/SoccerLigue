"use client"; // Marca el componente como del lado del cliente

import React, { useEffect } from "react";
import { useState } from "react";
import type { Match,Team,Location } from "@/lib/types";
import { formatDateToLetters, validateMatchData } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import {  getTeamsAndLocations, updateMatchInDatabase } from "@/app/actions/actions";
import { useRouter } from "next/navigation";

interface DetailsProps {
  match: Match; 
}

const times = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export default function Details({match}:DetailsProps){
 
  
 const [location, setLocation] = useState<string>("");
  const [referee,setReferee] = useState<Team|null>(match?.referee);
  const [isEditable, setIsEditable] = useState<boolean>(false);
    const [date, setDate] = useState<Date | undefined >(new Date());
  const [time, setTime] = useState<string>("10:50");
  const [Referees, setReferees] = useState<Team[]|undefined>([]);
    const [Locations, setLocations] = useState<Location[]|undefined>([]);
  const router = useRouter();
  useEffect(()=>{
     // Lista de equipos disponibles
     async function dataFetch(){
 
       const TeamsandLocations = await getTeamsAndLocations()
       console.log("teams",TeamsandLocations)
       const {Locations,Referees} = TeamsandLocations
       if(TeamsandLocations){
         setLocations(Locations)
         setReferees(Referees)
       }
     }
 void dataFetch()
   },[])

 useEffect(() => {
  if (match) {
      try {
        const matchDate = new Date(match?.date); // Match start time
        const matchCreation = new Date(match?.createdAt); // When the match was created
        const currentDate = new Date()
        const twoHoursAfterMatch = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after start
        const matchDuration = 105 * 60 * 1000; // 90 minutes in milliseconds
        const matchEndTime = new Date(matchDate.getTime() + matchDuration); // Match end time
       

        // console.log("Current date:", currentDate);
        // console.log("Match date:", matchDate);
        // console.log("Match end time:", matchEndTime);
        // console.log("Two hours after match:", twoHoursAfterMatch);

        // Check if the match is editable
        setIsEditable(currentDate > matchCreation && currentDate < twoHoursAfterMatch);

        // Check if the match has ended
        // setIsReadyForResults(currentDate > matchDate);

        // Check if results are available (assuming `matchData.results` exists)
        // setIsResultsAvailable(matchData.results && matchData.results.length > 0);
      } catch (error) {
        console.error("Error decoding match data:", error);
      }
    }
   } , [match])


  // Manejar el envío del formulario de edición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;
    // Aquí puedes agregar la lógica para guardar los cambios en la base de datos
    const updatedMatch = {
      ...match,
      location: location,
      refereeId: referee?.id,
      referee: referee,
      date: date,
      time: time,

    };
    let validatedMatch;
    try {
      
      validatedMatch = validateMatchData(updatedMatch);
    } catch (error) {
      console.error("Validation error:", error);
      return;
    }
    
    const updatedMatchReq= await updateMatchInDatabase(match.id,validatedMatch);

    console.log("Updated Match:", updatedMatchReq);
    alert("Match details updated successfully!");
 
    router.push("/matches");
  };

  if (!match) {
    return <div>Loading...</div>;
  }

console.log("Decoded match data:", match);

console.log("Is editable:", isEditable);

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg m-6">
      <h1 className=" flex justify-around text-3xl font-bold mb-4 text-orange-700">
        {match?.homeTeam?.name} vs {match?.awayTeam?.name}
      </h1>
     <div className="flex flex-row justify-around flex-wrap gap-4 p-2 bg-gray-700 rounded-lg shadow-md mb-2">
  <p className="text-lg ">
    <span className="font-bold text-primary">Location:</span> {match?.Location?.name}
  </p>
  <p className="text-lg ">
    <span className="font-bold text-primary">Referee:</span> {match?.referee?.name ?? "Not assigned"}
  </p>
       <p className="text-lg xl:text-xl">
{formatDateToLetters(match?.date)} at {match?.time}
      </p>
</div>
     <div className="flex flex-row justify-around gap-6 p-2 bg-gray-100 rounded-lg shadow-md">

</div>

      {isEditable ? (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-2 p-2 rounded-lg shadow-md ">
            <div className="flex flex-row justify-around mt-3">
              <h2 className="text-xl font-bold mb-4 text-center">Edit Match Details</h2>
                 <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Save changes
                </button>
            </div>
              <div className="flex flex-col gap-2 md:flex-row md:gap-4 md: justify-around">

            <div className="grid grid-cols-2 sm:grid-cols:3 md:grid-cols-1 items-center pt-2 justify-around gap-2">
              <div>
                <label htmlFor="location" className="block text-lg mb-1">
                  Location
                </label>
                <select
                onChange={(e)=>setLocation(e.target.value)}
                value={location}
                className=" p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value={match?.Location.name}>{match?.Location.name}</option>
                  {Locations?.map((location)=>
                  <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
            
              </div>
              <div>
                <label htmlFor="time" className="block text-lg mb-1">
                  time
                </label>
                <select
                onChange={(e)=>setTime(e.target.value)}
                value={time}
                className=" p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value={match?.time}>{match?.time}</option>
                  {times.map((time)=>
                  <option key={time} value={time}>{time}</option>)}
                </select>
            
              </div>
              <div>
                <label htmlFor="Referee" className="block text-lg mb-1">
                  Referee
                </label>
                <select
               onChange={(e) => {
    const selectedReferee = Referees?.find(r => r.id === e.target.value);
    setReferee(selectedReferee ?? null);
  }}
                value={referee?.id} className=" p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value={match?.referee?.id??""}>{match?.referee?.name ?? "Not assigned"}</option>
                  {Referees?.map((referee)=>
                  <option key={referee.id} value={referee.id}>{referee.name}</option>)}
                </select>
             
              </div>
                    </div>
              <div className=" w-full pt-2 md:w-1/2">
                <label htmlFor="date" className=" text-lg mb-1">
                  date
                </label>
              
                <div className=" flex w-1/2">
                  <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-lg border border-gray-700"
                            />
                </div>
             
              </div>
              </div>
           
            </form>
          
      ) : (
        <p className="text-red-500 text-lg flex justify-center m-2 pt-4">
          This match cannot be edited anymore.
        </p>
      )}
    </div>
  );
};

