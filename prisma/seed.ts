import { faker } from "@faker-js/faker"; 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.location.createMany({
    data: Array.from({ length: 3 }, () => ({ name: faker.location.city() })),
  });

  // Create Teams
  await prisma.team.createMany({
    data: Array.from({ length: 5 }, () => ({ name: faker.company.name() })),
  });

  console.log("Locations and teams created successfully.");

  // // Retrieve created teams
  // const teams = await prisma.team.findMany();
  // if (teams.length < 4) throw new Error("Not enough teams created.");

  // const [teamA, teamB,] = teams;

  // // Function to generate players
  // function generatePlayers(teamId: string) {
  //   return Array.from({ length: 17 }, (_, i) => ({
  //     name: faker.person.firstName("male") + " " + faker.person.lastName(),
  //     position: ["Forward", "Midfielder", "Defender"][i % 3], // Rotate positions
  //     number: faker.number.int({ min: 1, max: 99 }), // Random jersey number
  //     teamId,
  //   }));
  // }

  // // Create Players for Each Team
  // await prisma.player.createMany({ data: generatePlayers(teamA.id) });
  // await prisma.player.createMany({ data: generatePlayers(teamB.id) });


  // // Retrieve a location for match creation
  // const stadiums = await prisma.location.findMany();
  // if (stadiums.length === 0) throw new Error("No locations found.");

  // const stadium1 = stadiums[0];

  // // Create a Match
  // await prisma.match.create({
  //   data: {
  //     homeTeamId: teamA.id,
  //     awayTeamId: teamB.id,
  //     locationId: stadium1.id,
  //     date: new Date(),
  //     time: "15:00",
  //     judge: "Referee Jorge",
  //   },
  // });

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
