"use client"; // Marca el componente como del lado del cliente

import React from "react";
import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";

interface DetailsProps {
  match: Match; 
}
const Locations = [
  "Location A",
  "Location B",
  "Location C",
  "Location D",
  "Location E",
];
const Referees = [
  "Referee A",
  "Referee B",
  "Referee C",
  "Referee D",
  "Referee E",
];

export default function Details({match}:DetailsProps){
 
  
 const [location, setLocation] = useState<string>("");
  const [referee,setReferee] = useState<string|null>(match?.referee);
  const [isEditable, setIsEditable] = useState<boolean>(false);
    const [date, setDate] = useState<Date >(new Date());
  const [time, setTime] = useState<string>("10:50");
  /// crear inputs para hora y fecha

 

  // Manejar el envío del formulario de edición
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;
    // Aquí puedes agregar la lógica para guardar los cambios en la base de datos
    const updatedMatch = {
      ...match,
      location: location,
      referee: referee,
    };

    console.log("Updated Match:", updatedMatch);
    alert("Match details updated successfully!");
  };

  if (!match) {
    return <div>Loading...</div>;
  }

console.log("Decoded match data:", match);

console.log("Is editable:", isEditable);

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg m-6">
     <div className="flex flex-col justify-around gap-6 p-2 bg-gray-100 rounded-lg shadow-md">
      <h1 className=" flex justify-around text-3xl font-bold mb-4 text-gray-700">
        {match?.homeTeam?.name} vs {match?.awayTeam?.name}
      <p className="text-lg mb-2">
{new Date(match?.date).toLocaleDateString()} at {match?.time}
      </p>
      </h1>
     <div className="flex flex-row justify-around gap-6 p-2 bg-gray-100 rounded-lg shadow-md">

  <p className="text-lg text-gray-700">
    <span className="font-bold text-primary">Location:</span> {match?.Location?.name}
  </p>
  <p className="text-lg text-gray-700">
    <span className="font-bold text-primary">Referee:</span> {match?.referee ?? "Not assigned"}
  </p>
</div>
</div>


      {isEditable ? (
        <div className="flex flex-col items-center pt-4">
          <h2 className="text-2xl font-bold mb-4">Edit Match Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-lg mb-1">
                Location
              </label>
              <select 
              onChange={(e)=>setLocation(e.target.value)}
              value={match?.Location.name}
              className=" p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value={match?.Location.name}>{match?.Location.name}</option>
                {Locations.map((location)=>
                <option key={location} value={location}>{location}</option>)}
              </select>
              {/* <input
                type="text"
                id="location"
                defaultValue={match?.location}
                className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              /> */}
            </div>
            <div>
              <label htmlFor="Referee" className="block text-lg mb-1">
                Referee
              </label>
              <select 
              onChange={(e)=>setReferee(e.target.value)}
              value={match?.referee??""} className=" p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value={match?.referee??""}>{match?.referee ?? "Not assigned"}</option>
                {Referees.map((referee)=>
                <option key={referee} value={referee}>{referee}</option>)}

              </select>
              {/* <input
                type="text"
                id="referee"
                defaultValue={match?.referee || ""}
                className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              /> */}
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Save
            </button>
          </form>
        </div>
      ) : (
        <p className="text-red-500 text-lg">
          This match cannot be edited anymore.
        </p>
      )}
    </div>
  );
};

