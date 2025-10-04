// test-connection.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function test() {
  try {
    console.log("Testing connection...");
    // Test raw connection
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log("✅ Connection successful:", result);

    // Test table access
    const teams = await prisma.team.findMany();
    console.log("✅ Teams found:", teams.length);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
