import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.match.create({
    data: {
      homeTeam: "Team A",
      awayTeam: "Team B",
      date: new Date(),
      time: "15:00",
      location: "Stadium A",
    },
  });

  console.log("Match created successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });