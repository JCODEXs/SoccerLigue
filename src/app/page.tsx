import Scoreboard from "@/components/scoreBoard";


export default function HomePage() {
   const matchData = {
    Date: "2025-02-28",
    teamA: "Team A",
    teamB: "Team B",
    scoreA: 2,
    scoreB: 1,
    stats: {
      shots: { teamA: 10, teamB: 8 },
      shotsOnTarget: { teamA: 5, teamB: 3 },
      corners: { teamA: 4, teamB: 2 },
      fouls: { teamA: 12, teamB: 15 },
      cards: { teamA: 2, teamB: 3 },
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
