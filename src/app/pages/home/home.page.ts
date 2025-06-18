import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Pokemon } from 'src/app/interfaces/pokemon.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class HomePage implements OnInit {
  public allPokemons: Pokemon[] = [];
  public displayedPokemons: Pokemon[] = [];
  public filteredPokemons: Pokemon[] = [];
  public isLoading = false;
  public error: string | null = null;
  public currentPage = 1;
  public totalPages = 1;
  public searchTerm = '';
  public isSearching = false;
  private readonly itemsPerPage = 30;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.loadAllPokemons();
  }

  loadAllPokemons() {
    this.isLoading = true;
    this.error = null;

    this.pokemonService.getAllPokemons().subscribe({
      next: (pokemons) => {
        this.allPokemons = pokemons;
        this.filteredPokemons = pokemons;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error: string) => {
        this.error = error;
        this.isLoading = false;
        console.error('Error loading Pokémons:', error);
      }
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPokemons.length / this.itemsPerPage);
    this.loadPage(1);
  }

  loadPage(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPokemons = this.filteredPokemons.slice(startIndex, endIndex);
    this.currentPage = page;
  }

  searchPokemon() {
    if (!this.searchTerm.trim()) {
      this.filteredPokemons = this.allPokemons;
      this.isSearching = false;
      this.currentPage = 1;  // Reset to first page when clearing search
    } else {
      this.isSearching = true;
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.filteredPokemons = this.allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTermLower)
      );
      this.currentPage = 1;  // Reset to first page for new search results
    }
    this.updatePagination();
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
