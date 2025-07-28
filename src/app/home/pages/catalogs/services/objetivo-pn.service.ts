import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateObjetivoPnRequest,
  GeneralResponse,
  Objetivo,
  PaginatedResponse,
} from '../../../models/objetivo-pn.model';

@Injectable({
  providedIn: 'root',
})
export class ObjetivoService {
  private apiUrl = 'http://localhost:5034/api/objetivos'; // Asegúrate de apuntar correctamente

  constructor(private http: HttpClient) {}

  getPaginated(
    page: number,
    pageSize: number,
    filter: string = '',
    filterField: string = ''
  ): Observable<GeneralResponse<PaginatedResponse<Objetivo>>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    if (filter) {
      params = params.set('filter', filter).set('filterField', filterField);
    }

    return this.http.get<GeneralResponse<PaginatedResponse<Objetivo>>>(
      `${this.apiUrl}/paginated`,
      { params }
    );
  }

  create(data: CreateObjetivoPnRequest): Observable<GeneralResponse<Objetivo>> {
    return this.http.post<GeneralResponse<Objetivo>>(`${this.apiUrl}`, data);
  }

  update(
    id: number,
    data: CreateObjetivoPnRequest
  ): Observable<GeneralResponse<object>> {
    return this.http.put<GeneralResponse<object>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<GeneralResponse<object>> {
    return this.http.delete<GeneralResponse<object>>(`${this.apiUrl}/${id}`);
  }
}
