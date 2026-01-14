import type { EnrichedUser } from "../types/user";

const API_B = import.meta.env.VITE_API_B_URL;

export async function getEnrichedUser(uuid: string): Promise<EnrichedUser> {
  const res = await fetch(`${API_B}/users/enriched/${uuid}`);
  if (!res.ok) throw new Error("Dados ainda não enriquecidos");
  return res.json();
}
