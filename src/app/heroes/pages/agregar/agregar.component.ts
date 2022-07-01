import { HeroesService } from '../../services/heroes.service';

import { Heroe, Publisher } from '../../interfaces/heroes.interface';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    },
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  };

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    if (!this.router.url.includes('editar')) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroeById(id))
      )
      .subscribe( heroe => this.heroe = heroe);
  }

  guardar(): void {
    if(this.heroe.superhero.trim().length === 0) {
      return;
    }

    if(this.heroe.id ) {
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe( resp => {
          console.log('respuesta', resp);
        }
      );
    } else {
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe( heroe => {
          this.router.navigate(['/heroes/editar', heroe.id]);
        }
      );
    }
  }

  borrarHeroe(): void {
    this.heroesService.borrarHeroe(this.heroe.id!)
      .subscribe( () => {
        this.router.navigate(['/heroes']);
      }
    );
  }

}
