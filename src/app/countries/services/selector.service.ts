import { Country } from '../interfaces/countries.interface';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectorService {

  private _urlRestCountries = 'https://restcountries.com/v3.1';
  private _fields: string = 'fields=name,ccn3';
  private _continents = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania'
  ];

  get continents(): string[] {
    return [ ...this._continents ];
  }

  constructor(
    private http: HttpClient
  ) { }

  getCountriesByContinent(continent: string): Observable<Country[]>{
    return this.http
      .get<Country[]>(
        `${ this._urlRestCountries }/region/${ continent }?${ this._fields }`
      );
  }

  getCountryByCode(code: string): Observable<Country | null>{  
    if (!code) {
      return of(null);
    }
    return this.http
      .get<Country>(
        `${ this._urlRestCountries }/alpha/${ code }?fields=borders`
      );
  }

  getCountryNameByCode(code: string): Observable<Country>{  
    return this.http
      .get<Country>(
        `${ this._urlRestCountries }/alpha/${ code }?${ this._fields }`
      );
  }

  getCountriesByCode( borders: string[]): Observable<Country[]>{
    if (!borders) {
      return of([]);
    }
    const requests: Observable<Country>[] = [];
    borders.forEach( border => {
      const request = this.getCountryNameByCode(border);
      requests.push(request);
    });
    return combineLatest(requests);
  }
}
