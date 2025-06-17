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
  abilities?: PokemonAbility[];
  moves?: PokemonMove[];
  species?: PokemonSpecies;
  sprites?: PokemonSprites;
  baseExperience?: number;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonMove {
  name: string;
  learnMethod: string;
  learnedAt: number;
}

export interface PokemonSpecies {
  name: string;
  description: string;
  habitat: string;
  generation: string;
  growthRate: string;
  captureRate: number;
}

export interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny: string;
  back_shiny: string;
}
