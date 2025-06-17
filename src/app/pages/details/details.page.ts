import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  currentId: number = 1;
  readonly MAX_POKEMON_ID = 1010; // Limite atual da PokéAPI

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    // Adiciona foco ao container para capturar eventos de teclado
    setTimeout(() => {
      const content = document.querySelector('ion-content');
      if (content) {
        content.tabIndex = 0;
        content.focus();
      }
    }, 100);

    this.pokemon$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.pokemonService.getPokemonById(id)),
      tap({
        next: (pokemon) => {
          this.isLoading = false;
          this.currentId = pokemon.id;
          // Adiciona classe de animação
          const container = document.querySelector('.content-container');
          if (container) {
            container.classList.add('fade-in');
            setTimeout(() => container.classList.remove('fade-in'), 500);
          }
        },
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

  getStatName(statName: string): string {
    const statTranslations: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      'speed': 'Velocidade'
    };
    return statTranslations[statName] || statName;
  }

  getLearnMethod(method: string): string {
    const methodTranslations: { [key: string]: string } = {
      'level-up': 'Evolução de Nível',
      'egg': 'Ovo',
      'tutor': 'Tutor de Movimentos',
      'machine': 'MT/MT',
      'stadium-surfing-pikachu': 'Evento Especial',
      'light-ball-egg': 'Ovo Especial',
      'colosseum-purification': 'Purificação',
      'xd-shadow': 'Movimento Sombrio',
      'xd-purification': 'Purificação XD',
      'form-change': 'Mudança de Forma',
      'zygarde-cube': 'Cubo Zygarde'
    };
    return methodTranslations[method] || method;
  }

  async goToNextPokemon() {
    if (this.currentId >= this.MAX_POKEMON_ID) {
      return;
    }

    const nextId = this.currentId + 1;
    await this.router.navigate(['/details', nextId]);

    if (nextId === this.MAX_POKEMON_ID) {
      // Aguarda a navegação ser concluída
      setTimeout(() => {
        // Mostra mensagem quando chegar ao último Pokémon
        this.showLastPokemonMessage();
      }, 500);
    }
  }

  private showLastPokemonMessage() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Você chegou ao último Pokémon disponível!';
    toast.duration = 3000;
    toast.position = 'bottom';
    toast.color = 'warning';
    document.body.appendChild(toast);
    toast.present();
  }

  async goToPreviousPokemon() {
    const previousId = this.currentId - 1;
    if (previousId >= 1) {
      await this.router.navigate(['/details', previousId]);
    }
  }
}
