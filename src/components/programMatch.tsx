"use client"; // Marca el componente como del lado del cliente

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar"; // DatePicker de shadcn/ui
import { Input } from "@/components/ui/input"; // Input de shadcn/ui
import { Button } from "@/components/ui/button"; // Button de shadcn/ui
import { useMatchStore } from "@/app/stores/matchStore";
import { saveMatchToDatabase } from "@/app/actions/actions"; 


// Lista de equipos disponibles
const teams = [
  "Team A",
  "Team B",
  "Team C",
  "Team D",
  "Team E",
];

const ProgramMatch: React.FC = () => {
  // Estados para los equipos, fecha, hora y lugar
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("10:50");
  const [location, setLocation] = useState<string>("");

  // Zustand store para manejar el estado local
  const { addMatch } = useMatchStore();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!homeTeam || !awayTeam || !date || !time || !location) {
      alert("Please fill in all fields.");
      return;
    }

    // Crear el objeto del partido
    const match = {
      homeTeam,
      awayTeam,
      date,
      time,
      location,
    };

    try {
      // Guardar el partido en la base de datos usando una Server Action
      const response = await saveMatchToDatabase(match);

      if (response.success) {
        // Agregar el partido al estado local usando Zustand
        addMatch(match);
        alert("Match scheduled successfully!");
      } else {
        alert("Failed to schedule match. Please try again.");
      }
    } catch (error) {
      console.error("Error scheduling match:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-orange-400">
        Schedule Match
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Home Team */}
        <div className="space-y-2">
          <label className="text-lg text-teal-400">Home Team</label>
          <select
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="" disabled>
              Select a team
            </option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Away Team */}
        <div className="space-y-2">
          <label className="text-lg text-terracotta-400">Away Team</label>
          <select
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-400"
          >
            <option value="" disabled>
              Select a team
            </option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row justify-around ">
        {/* Match Date */}
             <div className="space-y-2">

          <label className="text-lg text-orange-400">Match Date</label>
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
            <label className="text-lg text-orange-400">Match Time</label>
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
          <label className="text-lg text-orange-400">Match Location</label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter the match location"
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
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