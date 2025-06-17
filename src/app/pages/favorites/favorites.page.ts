import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class FavoritesPage implements OnInit {
  favorites$ = this.favoritesService.favorites$;

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit() { }

  removeFavorite(pokemon: Pokemon): void {
    this.favoritesService.removeFavorite(pokemon.id);
  }
}
