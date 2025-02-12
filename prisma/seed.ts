import { faker } from "@faker-js/faker"; 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Locations
  const stadium1 = await prisma.location.create({ data: { name: "Stadium A" } });
  const stadium2 = await prisma.location.create({ data: { name: "Stadium B" } });
  const stadium3 = await prisma.location.create({ data: { name: "Stadium C" } });

  // Create Teams
  const teamA = await prisma.team.create({ data: { name: "Team A" } });
  const teamB = await prisma.team.create({ data: { name: "Team B" } });
  const teamC = await prisma.team.create({ data: { name: "Team C" } });
  const teamD = await prisma.team.create({ data: { name: "Team D" } });
  const teamE = await prisma.team.create({ data: { name: "Team E" } });


function generatePlayers(teamId: string) {
  return Array.from({ length: 17 }, (_, i) => ({
    name: faker.person.firstName("male") + " " + faker.person.lastName(),
    position: ["Forward", "Midfielder", "Defender"][i % 3], // Rotate positions
    number: faker.number.int({ min: 1, max: 99 }), // Random jersey number
    teamId,
  }));
}

// Create Players for Team A
await prisma.player.createMany({
  data: generatePlayers(teamA.id),
});

// Create Players for Team B
await prisma.player.createMany({
  data: generatePlayers(teamB.id),
});
// Create Players for Team C
await prisma.player.createMany({
  data: generatePlayers(teamC.id),
});

// Create Players for Team D
await prisma.player.createMany({
  data: generatePlayers(teamD.id),
});


  // Create a Match
  await prisma.match.create({
    data: {
      homeTeamId: teamA.id,
      awayTeamId: teamB.id,
      locationId: stadium1.id,
      date: new Date(),
      time: "15:00",
      judge: "refere Jorge",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
