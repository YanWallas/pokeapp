import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favoritePokemon';
  private favoritesSubject = new BehaviorSubject<Pokemon[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const favorites = JSON.parse(stored);
      this.favoritesSubject.next(favorites);
    }
  }

  private saveFavorites(favorites: Pokemon[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  addFavorite(pokemon: Pokemon): void {
    const currentFavorites = this.favoritesSubject.value;
    if (!this.isFavorite(pokemon.id)) {
      this.saveFavorites([...currentFavorites, pokemon]);
    }
  }

  removeFavorite(pokemonId: number): void {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(p => p.id !== pokemonId);
    this.saveFavorites(updatedFavorites);
  }

  isFavorite(pokemonId: number): boolean {
    return this.favoritesSubject.value.some(p => p.id === pokemonId);
  }

  getFavorites(): Pokemon[] {
    return this.favoritesSubject.value;
  }
}
