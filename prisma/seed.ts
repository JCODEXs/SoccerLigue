import { faker } from "@faker-js/faker"; 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.location.createMany({
    data: Array.from({ length: 3 }, () => ({ name: faker.location.city() })),
  });

  // Crear Equipos
  await prisma.team.createMany({
    data: Array.from({ length: 5 }, () => ({ name: faker.company.name() })),
  });

  console.log("Localidades y equipos creados correctamente.");
}



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
