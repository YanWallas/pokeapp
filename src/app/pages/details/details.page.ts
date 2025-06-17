import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class DetailsPage implements OnInit {
  pokemon$!: Observable<Pokemon>;
  error: string | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    this.pokemon$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.pokemonService.getPokemonById(id)),
      tap({
        next: () => this.isLoading = false,
        error: (error) => {
          this.error = error;
          this.isLoading = false;
        }
      })
    );
  }

  isFavorite(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }

  toggleFavorite(pokemon: Pokemon): void {
    if (this.isFavorite(pokemon.id)) {
      this.favoritesService.removeFavorite(pokemon.id);
    } else {
      this.favoritesService.addFavorite(pokemon);
    }
  }
}
