import { db } from "@/server/db";
import { NextResponse } from "next/server";

interface TeamRequest {
  name: string;
  players: { name: string; position: string; number: number }[];
}

interface PlayerRequest {
  teamId: string;
  name: string;
  position: string;
  number: number;
}

export async function GET() {
  try {
    const teams = await db.team.findMany({ include: { players: true } });
    return NextResponse.json({ success: true, teams });
  } catch (error) {
    console.error("Error fetching teams:", (error as Error).stack ?? error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch teams. Please try again later." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, players } = (await req.json()) as TeamRequest;
console.log("players",players)
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid team name." },
        { status: 400 }
      );
    }

    if (!Array.isArray(players)) {
      return NextResponse.json(
        { success: false, message: "Players must be provided as an array." },
        { status: 400 }
      );
    }

    for (const player of players) {
      if (!player.name || !player.position || typeof player.number !== "number") {
        return NextResponse.json(
          { success: false, message: "Invalid player data. Each player must have a name, position, and number." },
          { status: 400 }
        );
      }
    }

    const newTeam = await db.team.create({
      data: {
        name,
        players: {
          create: players.map((player) => ({
            name: player.name,
            position: player.position,
            number: player.number,
          })),
        },
      },
      include: { players: true },
    });

    return NextResponse.json({ success: true, team: newTeam }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", (error as Error).stack ?? error);
    return NextResponse.json(
      { success: false, message: "Failed to create team. Please try again later." },
      { status: 500 }
    );
  }
}
interface DeleteTeamRequest {
  teamId: string;
}
export async function DELETE(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body:DeleteTeamRequest = await req.json();
    const { teamId }: { teamId?: string } = body;

    if (!teamId) {
      return NextResponse.json({ success: false, message: "No team ID provided" }, { status: 400 });
    }

    console.log("teamID",teamId)
    // Set players' teamId to null (keep players but dissociate them from the team)
    await db.player.updateMany({
      where: { teamId },
      data: { teamId: null }, // Disassociate players from the team
    });
    // Matches will continue to reference teams even if teams are deleted

  
   const team= await db.team.delete({
      where: { id: teamId },
    });
console.log(team)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    const { teamId, players } = await req.json() as { teamId: string; players: { name: string; position: string; number: number }[] };
console.log(teamId,players)
    if (!teamId || !Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid team ID or player data." },
        { status: 400 }
      );
    }

    // Validate all players
    for (const player of players) {
      if (!player.name || !player.position || typeof player.number !== "number") {
        return NextResponse.json(
          { success: false, message: "Each player must have a valid name, position, and number." },
          { status: 400 }
        );
      }
    }

    // Insert all players in one transaction
    const newPlayers = await db.player.createMany({
      data: players.map(player => ({ ...player, teamId })),
    });
    console.log("new player",newPlayers)

    return NextResponse.json({ success: true, players: newPlayers }, { status: 201 });
  } catch (error) {
    console.error("Error adding players:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add players. Please try again later." },
      { status: 500 }
    );
  }
}
