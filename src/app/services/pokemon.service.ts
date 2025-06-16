import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const API_URL = 'https://pokeapi.co/api/v2';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  getPokemons() {
    return this.http.get(`${API_URL}/pokemon?limit=151`).pipe(
      map((response: any) => {

        const results = response.results;

        return results.map((pokemon: any, index: number) => {
          const id = index + 1;
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

          return { ...pokemon, id, image };
        });
      })
    );
  }
}
