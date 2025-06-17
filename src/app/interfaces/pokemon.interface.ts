export interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}

export interface PokemonResult {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  url: string;
  types?: string[];
  height?: number;
  weight?: number;
  stats?: PokemonStat[];
}

export interface PokemonStat {
  name: string;
  value: number;
}
