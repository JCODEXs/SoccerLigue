import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { z } from "zod";


const updatePlayerSchema = z.object({
  playerId: z.string().uuid(), // Ensure it's a valid UUID
  newTeamId: z.string().uuid(),
});

export async function PATCH(req: Request) {
  try {
   
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = updatePlayerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { playerId, newTeamId } = result.data;

    const playerExists = await db.player.findUnique({
      where: { id: playerId },
    });

    if (!playerExists) {
      return NextResponse.json(
        { success: false, message: "Player not found" },
        { status: 404 }
      );
    }

    const teamExists = await db.team.findUnique({
      where: { id: newTeamId },
    });

    if (!teamExists) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    const updatedPlayer = await db.player.update({
      where: { id: playerId },
      data: { teamId: newTeamId },
    });

    return NextResponse.json({ success: true, player: updatedPlayer });
  } catch (error) {
    console.error("Error reassigning player:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

