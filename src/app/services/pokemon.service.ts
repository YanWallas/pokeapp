import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pokemon, PokemonResponse } from '../interfaces/pokemon.interface';

const API_URL = 'https://pokeapi.co/api/v2';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  readonly ITEMS_PER_PAGE = 30;
  readonly TOTAL_POKEMONS = 1010;

  getPage(page: number): Observable<{
    pokemons: Pokemon[],
    totalPages: number
  }> {
    const offset = (page - 1) * this.ITEMS_PER_PAGE;
    const limit = this.ITEMS_PER_PAGE;
    const totalPages = Math.ceil(this.TOTAL_POKEMONS / this.ITEMS_PER_PAGE);

    return this.http.get<PokemonResponse>(`${API_URL}/pokemon?offset=${offset}&limit=${limit}`).pipe(
      map((response) => ({
        pokemons: response.results.map((pokemon) => {
          const id = Number(pokemon.url.split('/').filter(Boolean).pop());
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return { ...pokemon, id, image };
        }),
        totalPages
      })),
      catchError(this.handleError)
    );
  }

  private offset = 0;
  private limit = 50;


  private getSpecies(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/pokemon-species/${id}`);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    const pokemon$ = this.http.get<any>(`${API_URL}/pokemon/${id}`);
    const species$ = this.getSpecies(id);

    return new Observable<Pokemon>(observer => {
      pokemon$.pipe(
        map(pokemonData => ({
          ...({} as Pokemon),
          id: pokemonData.id,
          name: pokemonData.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`,
          url: `${API_URL}/pokemon/${pokemonData.id}`,
          types: pokemonData.types.map((t: any) => this.translateType(t.type.name)),
          height: pokemonData.height,
          weight: pokemonData.weight,
          stats: pokemonData.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat
          })),
          abilities: pokemonData.abilities.map((a: any) => ({
            name: a.ability.name,
            isHidden: a.is_hidden
          })),
          moves: pokemonData.moves.slice(0, 10).map((m: any) => ({
            name: m.move.name,
            learnMethod: m.version_group_details[0].move_learn_method.name,
            learnedAt: m.version_group_details[0].level_learned_at
          })),
          sprites: pokemonData.sprites,
          baseExperience: pokemonData.base_experience
        }))
      ).subscribe({
        next: (pokemon) => {
          species$.pipe(
            map(speciesData => {
              const ptDescription = speciesData.flavor_text_entries
                .find((entry: any) => entry.language.name === 'pt-br') ||
                speciesData.flavor_text_entries
                .find((entry: any) => entry.language.name === 'en');

              pokemon.species = {
                name: speciesData.name,
                description: ptDescription ? ptDescription.flavor_text.replace(/\f/g, ' ') : '',
                habitat: this.translateHabitat(speciesData.habitat?.name || 'unknown'),
                generation: this.translateGeneration(speciesData.generation.name),
                growthRate: this.translateGrowthRate(speciesData.growth_rate.name),
                captureRate: speciesData.capture_rate
              };
              return pokemon;
            })
          ).subscribe({
            next: (completePokemon) => observer.next(completePokemon),
            error: (error) => observer.error(error),
            complete: () => observer.complete()
          });
        },
        error: (error) => observer.error(error)
      });
    }).pipe(
      catchError(this.handleError)
    );
  }

  private translateHabitat(habitat: string): string {
    const habitatTranslations: { [key: string]: string } = {
      'cave': 'caverna',
      'forest': 'floresta',
      'grassland': 'campo',
      'mountain': 'montanha',
      'rare': 'raro',
      'rough-terrain': 'terreno acidentado',
      'sea': 'mar',
      'urban': 'urbano',
      'waters-edge': 'beira d\'água',
      'unknown': 'desconhecido'
    };
    return habitatTranslations[habitat] || habitat;
  }

  private translateGeneration(generation: string): string {
    const generationTranslations: { [key: string]: string } = {
      'generation-i': 'Primeira Geração',
      'generation-ii': 'Segunda Geração',
      'generation-iii': 'Terceira Geração',
      'generation-iv': 'Quarta Geração',
      'generation-v': 'Quinta Geração',
      'generation-vi': 'Sexta Geração',
      'generation-vii': 'Sétima Geração',
      'generation-viii': 'Oitava Geração',
      'generation-ix': 'Nona Geração'
    };
    return generationTranslations[generation] || generation;
  }

  private translateGrowthRate(rate: string): string {
    const rateTranslations: { [key: string]: string } = {
      'slow': 'lento',
      'medium': 'médio',
      'fast': 'rápido',
      'medium-slow': 'médio-lento',
      'slow-then-very-fast': 'lento, depois muito rápido',
      'fast-then-very-slow': 'rápido, depois muito lento'
    };
    return rateTranslations[rate] || rate;
  }

  private translateType(type: string): string {
    const typeTranslations: { [key: string]: string } = {
      'normal': 'normal',
      'fire': 'fogo',
      'water': 'água',
      'electric': 'elétrico',
      'grass': 'planta',
      'ice': 'gelo',
      'fighting': 'lutador',
      'poison': 'veneno',
      'ground': 'terra',
      'flying': 'voador',
      'psychic': 'psíquico',
      'bug': 'inseto',
      'rock': 'pedra',
      'ghost': 'fantasma',
      'dragon': 'dragão',
      'dark': 'sombrio',
      'steel': 'aço',
      'fairy': 'fada'
    };
    return typeTranslations[type] || type;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro';
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
