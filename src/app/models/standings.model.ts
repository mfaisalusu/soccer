export interface StandingTeam {
  id: string;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

export interface StandingEntry {
  position: number;
  team: StandingTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: ('win' | 'draw' | 'loss')[];
}

export interface StandingGroup {
  stage: string;
  type: string;
  group: string;
  table: StandingEntry[];
}
