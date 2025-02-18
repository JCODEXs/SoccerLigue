export type MatchStats = {
  shots: { homeTeam: number; awayTeam: number };
  shotsOnTarget: { homeTeam: number; awayTeam: number };
  corners: { homeTeam: number; awayTeam: number };
  fouls: { homeTeam: number; awayTeam: number };
  cards: { homeTeam: number; awayTeam: number };
};
export type stats={
 goals:number
  shots: number
  shotsOnTarget: number
  corners: number
  fouls: number
  cards: number
}

export type TeamStats = {
 homeTeam:stats
 awayTeam:stats
};
export type MatchEvent = {
  team: string |null;
  type: string;
  card: string | null;
  player: string;
  id: string;
  assistant: string | null;
  substitute: string | null;
  timestamp: string;
  matchId: string | null;
};

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamScore: number;
  awayTeamScore: number;
  homeTeamShots: number;
  awayTeamShots: number;
  homeTeamShotsOnTarget: number;
  awayTeamShotsOnTarget: number;
  homeTeamCorners: number;
  awayTeamCorners: number;
  homeTeamFouls: number;
  awayTeamFouls: number;
  homeTeamCards: number;
  awayTeamCards: number;
  homeTeamYellowCards: number;
  awayTeamYellowCards: number;
  homeTeamRedCards: number;
  awayTeamRedCards: number;
  homeTeamSubstitutions: number;
  awayTeamSubstitutions: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  homeTeamAssists: number;
  awayTeamAssists: number;}
  

export type MatchData = {
  Date: string;
  homeTeam: string|null;
  awayTeam: string|null;
  scoreA: number;
  scoreB: number;
  stats: MatchStats;
};
export type SavedMatchData = {
  events: Event[];
 matchId: string,
homeTeam:string,
awayTeam:string,
};
export type Event= {
  type: string;
  team: string;
  player: string;
  assistant?: string;
  card?:string;
  substitute?:string;
  timestamp: string;
}
export type Player = {
  id: string;
  name: string;
  position: string;
  number: number;
  teamId?: string | null;
  createdAt: Date;
};

type PlayersList = Player[];
