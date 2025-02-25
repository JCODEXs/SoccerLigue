import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToLetters(date: string | Date, locale = "en-US"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    weekday: "short", // Full day name
    year: "numeric",
    month: "short", // Full month name
    day: "numeric",
  });
}

export function validateMatchData(match: {
  homeTeamId: string | null;
  awayTeamId: string | null;
  locationId: string | null;
  date: Date | undefined;
  referee: string | null;
  time: string | null;
}) {
  console.log(match);
  if (!match.homeTeamId || !match.awayTeamId || !match.locationId || !match.date || !match.time) {
    throw new Error("Match data is incomplete or invalid.");
  }

  return {
    homeTeamId: match.homeTeamId , // Ensured non-null
    awayTeamId: match.awayTeamId ,
    locationId: match.locationId ,
    date: match.date ,
    referee: match.referee ?? "No Referee Assigned", // Default if null
    time: match.time ,
  };
}

export const footballPositions = [
  { name: "Goalkeeper", abbreviation: "GK" },
  { name: "Sweeper", abbreviation: "SW" },
  { name: "Center Back", abbreviation: "CB" },
  { name: "Right Back", abbreviation: "RB" },
  { name: "Left Back", abbreviation: "LB" },
  { name: "Right Wing Back", abbreviation: "RWB" },
  { name: "Left Wing Back", abbreviation: "LWB" },
  { name: "Defensive Midfielder", abbreviation: "DM" },
  { name: "Center Midfielder", abbreviation: "CM" },
  { name: "Right Midfielder", abbreviation: "RM" },
  { name: "Left Midfielder", abbreviation: "LM" },
  { name: "Attacking Midfielder", abbreviation: "AM" },
  { name: "Right Winger", abbreviation: "RW" },
  { name: "Left Winger", abbreviation: "LW" },
  { name: "Center Forward", abbreviation: "CF" },
  { name: "Striker", abbreviation: "ST" },
];




