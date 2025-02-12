import Scoreboard from "@/components/scoreBoard";


export default function HomePage() {
   const matchData = {
    Date: "2025-02-28",
    homeTeam: "Team A",
    awayTeam: "Team B",
    scoreA: 2,
    scoreB: 1,
    stats: {
      shots: { homeTeam: 10, awayTeam: 8 },
      shotsOnTarget: { homeTeam: 5, awayTeam: 3 },
      corners: { homeTeam: 4, awayTeam: 2 },
      fouls: { homeTeam: 12, awayTeam: 15 },
      cards: { homeTeam: 2, awayTeam: 3 },
    },
  };
  return (
    <main className="">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
         <span className="text-[hsl(281, 82.90%, 6.90%)]">Last</span> Match
        </h1>
  <Scoreboard matchData={matchData} />
     </div>
    </main>
  );
}
