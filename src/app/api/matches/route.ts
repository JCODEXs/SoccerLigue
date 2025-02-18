import { db } from "@/server/db";

// Handle GET request
export async function GET(req: Request) {
  try {
    const matches = await db.match.findMany({
      orderBy: { date: 'asc' },
      include: {
    homeTeam: {
      select: {
        name: true, // Include the name of the home team
        id: true,
      },
    },
    awayTeam: {
      select: {
        name: true, // Include the name of the away team
        id: true,
      },
    },
    Location: {
      select: {
        name: true, // Include location name if needed
        id:true,
      },
    },
    events:true
  },
    });
    return new Response(JSON.stringify(matches), { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch matches' }),
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

  

