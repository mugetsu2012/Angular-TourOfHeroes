import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../shared/models/hero';
import { HeroService } from '../core/services/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();


  constructor(private heroService: HeroService) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }


  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(

      // esperar 300ms despues de cada tecla oprimida
      debounceTime(300),

      // ignorar la nueva busqueda si es igual a la anterior
      distinctUntilChanged(),

      // cada vez que el termino cambia, realizamos una nueva busqueda
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

}
