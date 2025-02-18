import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Locations
  const locations = Array.from({ length: 3 }, () => ({ name: faker.location.city() }));
  await prisma.location.createMany({ data: locations });

  // Create Teams
  const teams = Array.from({ length: 5 }, () => ({ name: faker.company.name() }));
  await prisma.team.createMany({ data: teams });

  console.log("Locations and teams created successfully.");
}

void main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
