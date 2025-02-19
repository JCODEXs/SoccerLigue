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
export type Event= {
  type: string;
  team: string;
  player: string;
  assistant?: string;
  card?:string;
  substitute?:string;
  timestamp: string;
}
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
export type Team={
  id:string;
  name:string
}

export type Match = {
  id: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  locationId: string;
  date: Date;
  time: string;
  referee: string|null;
  events: MatchEvent[];
  homeTeam: Team | null;
  awayTeam: Team | null;
  createdAt: Date;
  updatedAt: Date;
  Location:Team;

};


export type MatchData = {
  date: Date;
  time: string;
  Location:Team;
  referee:string;
  homeTeam: Team|null;
  awayTeam: Team|null;
  locationId: string;
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
export type Player = {
  id: string;
  name: string;
  position: string;
  number: number;
  teamId?: string | null;
  createdAt: Date;
};

export type Location ={
  id:string;
  name:string;
}
