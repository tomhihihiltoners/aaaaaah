export interface Team {
  id: string;
  name: string;
  score: number;
}

export function createInitialTeams(): Team[] {
  return [
    { id: "team-1", name: "Team 1", score: 0 },
    { id: "team-2", name: "Team 2", score: 0 },
    { id: "team-3", name: "Team 3", score: 0 },
  ];
}

export function createTeam(teamNumber: number): Team {
  const randomSuffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  return {
    id: `team-${randomSuffix}`,
    name: `Team ${teamNumber}`,
    score: 0,
  };
}

export function normalizeTeamName(name: string, teamNumber: number) {
  const trimmedName = name.trim();
  return trimmedName.length > 0 ? trimmedName : `Team ${teamNumber}`;
}
