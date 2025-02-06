"use server"; // Marca la función como una Server Action

import { db } from "@/server/db"; // Importa Prisma Client

// Función para guardar el partido en la base de datos
export async function saveMatchToDatabase(match: {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  time: string;
  location: string;
}) {
  try {
    // Guardar el partido en la base de datos usando Prisma
    const newMatch = await db.match.create({
      data: {
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        time: match.time,
        location: match.location,
      },
    });

    return { success: true, id: newMatch.id };
  } catch (error) {
    console.error("Error saving match to database:", error);
    return { success: false };
  }
}