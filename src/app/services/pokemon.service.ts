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

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<PokemonResponse>(`${API_URL}/pokemon?limit=151`).pipe(
      map((response) => {
        return response.results.map((pokemon, index) => {
          const id = index + 1;
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

          return { ...pokemon, id, image };
        });
      }),
      catchError(this.handleError)
    );
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<any>(`${API_URL}/pokemon/${id}`).pipe(
      map((response) => {
        const pokemon: Pokemon = {
          id: response.id,
          name: response.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${response.id}.png`,
          url: `${API_URL}/pokemon/${response.id}`,
          types: response.types.map((t: any) => t.type.name),
          height: response.height,
          weight: response.weight,
          stats: response.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat
          }))
        };
        return pokemon;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
