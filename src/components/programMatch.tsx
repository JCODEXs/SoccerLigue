"use client"; // Marca el componente como del lado del cliente

import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"; // DatePicker de shadcn/ui
import { Input } from "@/components/ui/input"; // Input de shadcn/ui
import { Button } from "@/components/ui/button"; // Button de shadcn/ui
// import { useMatchStore } from "@/app/stores/matchStore";
import { getTeamsAndLocations, saveMatchToDatabase } from "@/app/actions/actions"; 
import type { Location, Team } from "@/lib/types";

const Referees = [
  "Referee A",
  "Referee B",
  "Referee C",
  "Referee D",
  "Referee E",
];

const ProgramMatch: React.FC = () => {
  // Estados para los equipos, fecha, hora y lugar
  const [homeTeamId, setHomeTeam] = useState<string>("");
  const [awayTeamId, setAwayTeam] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("10:50");
  const [locationId, setLocation] = useState<string>("");
  const [referee, setReferee] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [Locations, setLocations] = useState<Location[]|undefined>([]);

  // Zustand store para manejar el estado local
  // const { addMatch } = useMatchStore();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!homeTeamId || !awayTeamId || !date || !time || !location) {
      alert("Please fill in all fields.");
      return;
    }

    // Crear el objeto del partido
    const match = {
      homeTeamId,
      awayTeamId,
      date,
      time,
      locationId,
      referee,
    };

    try {
      // Guardar el partido en la base de datos usando una Server Action
      const response = await saveMatchToDatabase(match);

      if (response.success) {
        // Agregar el partido al estado local usando Zustand
        // addMatch(match);
        alert("Match scheduled successfully!");
      } else {
        alert("Failed to schedule match. Please try again.");
      }
    } catch (error) {
      console.error("Error scheduling match:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(()=>{
    // Lista de equipos disponibles
    async function dataFetch(){

      const TeamsandLocations = await getTeamsAndLocations()
      console.log("teams",TeamsandLocations)
      const {teams,Locations} = TeamsandLocations
      if(TeamsandLocations){
        setTeams(teams)
        setLocations(Locations)
      }
    }
void dataFetch()
  },[])
  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4 text-orange-400">
        Schedule Match
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Home Team */}
        <div className="space-y-1">
          <label className="text-lg text-teal-400">Home Team</label>
          <select
            value={homeTeamId}
            onChange={(e) => setHomeTeam(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="" disabled>
              Select a team
            </option>
            {teams?.map((team) => (
              <option key={team?.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Away Team */}
        <div className="space-y-1">
          <label className="text-lg text-terracotta-400">Away Team</label>
          <select
            value={awayTeamId}
            onChange={(e) => setAwayTeam(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400"
          >
            <option value="" disabled>
              Select a team
            </option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row justify-around gap-3 ">
        {/* Match Date */}
             <div className="space-y-2">

          <label className="text-lg text-orange-400">Match Date & Location </label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border border-gray-700"
            />
            </div>
            <div>

             <div className="space-y-2 flex flex-col">
            {/* Match Time */}
            <label className="text-lg text-orange-400">Time</label>
{/* <TimePicker onChange={setTime} value={time} format="HH:mm"  disableClock={false}/> */}
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
           {/* Match Location */}
        <div className="mt-6 space-y-2">
          <label className="text-lg text-orange-400">Location</label>
          <select
            value={locationId}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="" disabled>
                </option>
                Select a location
                {Locations?.map((location)=>
               
                <option  key={location?.id} value={location.id}>{location.name}</option>)}
             </select> 
        </div>
           {/* Match Referee */}
        <div className="mt-6 space-y-2">
          <label className="text-lg text-orange-400">Referee</label>
          <select
            value={referee}
            onChange={(e) => setReferee(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="" disabled>
                </option>
                Select a Referee
                {Referees.map((Referee)=>
               
                <option  key={Referee} value={Referee}>{Referee}</option>)}
             </select> 
        </div>
            </div>
        </div>


        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Schedule Match
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProgramMatch;