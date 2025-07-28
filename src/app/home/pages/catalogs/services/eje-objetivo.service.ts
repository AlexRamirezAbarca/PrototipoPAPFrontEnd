import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PaginatedResponse } from '../../../models/objetivo-pn.model';
import { EjeObjetivoRelacion } from '../../../models/eje-objetivo.model';


@Injectable({ providedIn: 'root' })
export class EjeObjetivoService {
  private apiUrl = 'http://localhost:5034/api/ejeobjetivopn';

  constructor(private http: HttpClient) {}

  getRelacionesPaginadas(page: number, pageSize: number): Observable<PaginatedResponse<EjeObjetivoRelacion>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<any>(`${this.apiUrl}/paginated`, { params }).pipe(
      // extraemos solo el campo 'data'
      map(response => response.data as PaginatedResponse<EjeObjetivoRelacion>)
    );
  }

   createRelacionEjeObjetivo(payload: { ejePnId: number; objPnId: number }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

}
