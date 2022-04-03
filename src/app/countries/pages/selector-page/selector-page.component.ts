import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";

import { SelectorService } from '../../services/selector.service';
import { Country } from '../../interfaces/countries.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  selectorForm: FormGroup = this.formBuilder.group({
    continent: [ '', [ Validators.required ] ],
    country: [ '', [ Validators.required ] ],
    border: [ '', [ Validators.required ] ]
  });

  //Selectors options
  continents: string[] = [];
  countries: Country[] = [];
  borders: Country[] = [];

  //UI
  loading: boolean = false;
 
  constructor(
    private formBuilder: FormBuilder,
    private selectorService: SelectorService
  ) { }

  ngOnInit(): void {
    this.continents = this.selectorService.continents;

    this.selectorForm.get('continent')?.valueChanges
      .pipe(
        tap( () => {
          this.selectorForm.get('country')?.reset('');
          this.loading = true;
        }),
        switchMap( continent =>
          this.selectorService.getCountriesByContinent(continent) 
        )
      )
      .subscribe( countries => {
        this.countries = countries 
        this.loading = false;
      });
    
    this.selectorForm.get('country')?.valueChanges
      .pipe(
        tap( () => {
          this.borders = [];
          this.selectorForm.get('border')?.reset('')
          this.loading = true;
        }),
        switchMap(
          code => this.selectorService.getCountryByCode(code)
        ),
        switchMap( country => this.selectorService.getCountriesByCode(country?.borders!))
      )
      .subscribe( borders => {
        this.borders = borders; 
        this.loading = false;
      });
    
  }
  
  save(): void {
    console.log(this.selectorForm.value);
  }

}
