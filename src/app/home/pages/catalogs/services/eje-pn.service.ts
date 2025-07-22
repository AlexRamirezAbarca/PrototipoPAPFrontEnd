import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateEjePnRequest,
  GeneralResponse,
  PaginatedEjePnResponse,
} from '../../../models/eje-pn.model';

@Injectable({
  providedIn: 'root',
})
export class EjePnService {
  private apiUrl = 'http://localhost:5034/api/ejes'; // Ajusta si es necesario

  constructor(private http: HttpClient) {}

  getPaginated(
    page: number,
    pageSize: number,
    filter: string = '',
    filterField: string = ''
  ): Observable<GeneralResponse<PaginatedEjePnResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter) params = params.set('filter', filter);
    if (filterField) params = params.set('filterField', filterField);

    return this.http.get<GeneralResponse<PaginatedEjePnResponse>>(
      `${this.apiUrl}/paginated`,
      { params }
    );
  }

  createEje(request: CreateEjePnRequest): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(`${this.apiUrl}`, request);
  }

  delete(id: number): Observable<GeneralResponse<object>> {
    return this.http.delete<GeneralResponse<object>>(`${this.apiUrl}/${id}`);
  }

  update(
    id: number,
    request: CreateEjePnRequest
  ): Observable<GeneralResponse<object>> {
    return this.http.put<GeneralResponse<object>>(
      `${this.apiUrl}/${id}`,
      request
    );
  }
}
