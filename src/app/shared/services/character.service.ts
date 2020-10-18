import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {Character} from '@shared/interfaces/character.interface';
import {environment} from '@environments/environment';
import {TrackHttpError} from '@shared/models/trackHttpError';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private http: HttpClient) { }

  searchCharacerts(query = '', page = 1): Observable<Character[] | TrackHttpError> {
    const filter = `${environment.baseUrl}/?name=${query}&page=${page}`;
    return this.http.get<Character[]>(filter)
      .pipe(catchError((err) => this.handleHttpError(err)));
  }

  getDetails(id: number): any{
    return this.http.get<Character>(`${environment.baseUrl}/${id}`)
      .pipe(catchError((err) => this.handleHttpError(err)));
  }

  private handleHttpError( error: HttpErrorResponse): Observable<TrackHttpError> {
    const dataError = new TrackHttpError();
    dataError.errorNumber = error.status;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error ocurred retrienving data.';
    return throwError(dataError);
  }
}
