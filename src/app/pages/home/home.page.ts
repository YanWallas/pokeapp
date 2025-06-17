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
  public currentPage = 1;
  public totalPages = 1;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPage(page).subscribe({
      next: (result) => {
        this.pokemons = result.pokemons;
        this.totalPages = result.totalPages;
        this.currentPage = page;
        this.isLoading = false;
      },
      error: (error: string) => {
        this.error = error;
        this.isLoading = false;
        console.error('Error loading Pokémons:', error);
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }
}
