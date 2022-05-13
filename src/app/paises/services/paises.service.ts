import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseURL: string = `https://restcountries.com/v2`;
  // private _regiones: string[] = [`Artificiero`, `Barbaro`, `Bardo`, `Clerigo`, `Druida`, `Guerrero`, `Monje`, `Hechicero`, `Mago`, `Paladin`, `Picaro`, `Brujo`];
  private _regiones: string[] = [`EU`, `EFTA`, `CARICOM`, `PA`, `AU`, `USAN`, `EEU`, `AL`, `ASEAN`, `CAIS`, `CEFTA`, `NAFTA`, `SAARC`];

  constructor( private http: HttpClient) { }

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    const url: string = `${this.baseURL}/regionalbloc/${region}?fields=alpha2Code,name`;
    return this.http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null>{
    if(!codigo){
      return of(null)
    }
    const url: string = `${this.baseURL}/alpha/${codigo}`;
    return this.http.get<Pais>( url );
  }

  getPaisesPorCodigoSmall( codigo: string ): Observable<PaisSmall>{
    const url = `${this.baseURL}/alpha/${codigo}?fields=nonValue,name,alpha2Code`;
    return this.http.get<PaisSmall>( url );
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {
    if( !borders ){
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach( codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );
  }
}
