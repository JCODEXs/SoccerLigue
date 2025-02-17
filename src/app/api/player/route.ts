export async function PATCH(req: Request) {
  try {
    const { playerId, newTeamId } = await req.json();

    if (!playerId || !newTeamId) {
      return NextResponse.json({ success: false, message: "Player ID and new team ID required" }, { status: 400 });
    }

    // Reassign the player to the new team
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { teamId: newTeamId },
    });

    return NextResponse.json({ success: true, player: updatedPlayer });
  } catch (error) {
    console.error("Error reassigning player:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
