import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {
  public pokemons: any[] = [];
  constructor(private pokemonService: PokemonService) { }
  ngOnInit() { this.loadPokemons(); }
  loadPokemons() {
    this.pokemonService.getPokemons().subscribe(dadosDaApi => {
      this.pokemons = dadosDaApi;
      console.log('Pokémons carregados com sucesso!', this.pokemons);
    });
  }
}
