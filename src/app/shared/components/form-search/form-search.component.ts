import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-form-search',
  template: `<input type="text"
                    #inputSearch
                    autofocus
                    [ngClass]="['form-control-lg']"
                    placeholder="Buscar..."
                    (keyup)="onSearch(inputSearch.value)">
  `,
  styles: ['input {width:100%;}'],
})
export class FormSearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSearch(value: string): any{
    if (value && value.length > 3){
      this.router.navigate(['/character-list'], {
        queryParams: {q: value},
      });
    }
  }

}
