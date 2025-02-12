import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET request
export async function GET(req: Request) {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { date: 'asc' },
      include: {
    homeTeam: {
      select: {
        name: true, // Include the name of the home team
      },
    },
    awayTeam: {
      select: {
        name: true, // Include the name of the away team
      },
    },
    location: {
      select: {
        name: true, // Include location name if needed
      },
    },
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
    await prisma.$disconnect();
  }
}

  

