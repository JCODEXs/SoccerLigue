// app/api/debug-env/route.ts
export async function GET() {
    return Response.json({
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length,
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('DB'))
    });
  }