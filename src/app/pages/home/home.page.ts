import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Pokemon } from 'src/app/interfaces/pokemon.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class HomePage implements OnInit {
  public pokemons: Pokemon[] = [];
  public isLoading = false;
  public error: string | null = null;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPokemons().subscribe({
      next: (data) => {
        this.pokemons = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error;
        this.isLoading = false;
        console.error('Error loading Pokémons:', error);
      }
    });
  }
}
