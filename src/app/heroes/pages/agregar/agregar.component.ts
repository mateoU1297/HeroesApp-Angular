import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

import { HeroesService } from '../../services/heroes.service';

import { Heroe, Publisher } from '../../interfaces/heroes.interface';

import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private router: Router,
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    public matDialog: MatDialog
  ) { }

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
        .subscribe(() => this.mostrarSnackBar('Registro actualizado'));
    } else {
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe( heroe => {
          this.mostrarSnackBar('Registro creado');
          this.router.navigate(['/heroes/editar', heroe.id]);
        }
      );
    }
  }

  borrarHeroe(): void {

    const dialog = this.matDialog.open( ConfirmarComponent, { 
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.heroesService.borrarHeroe(this.heroe.id!)
            .subscribe(() => {
              this.router.navigate(['/heroes']);
            }
          );
        }
      }
    )

  }

  mostrarSnackBar(mensaje: string): void {
    this.snackBar.open(mensaje, 'Ok!', {
      duration: 2000
    });
  }

}
