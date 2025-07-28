import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { CreateMetaPnRequest, GeneralResponse, MetaPn, PaginatedResponse } from '../../../models/meta-pn.model';


@Injectable({
  providedIn: 'root',
})
export class MetaPnService {
  private apiUrl = 'http://localhost:5034/api/MetaPlanNacionalDesarrollo';

  constructor(private http: HttpClient) {}

  getPaginated(
    page: number,
    pageSize: number,
    filter: string = '',
    filterField: string = ''
  ): Observable<GeneralResponse<PaginatedResponse<MetaPn>>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (filter && filterField) {
      params = params.set('filter', filter).set('filterField', filterField);
    }

    return this.http.get<GeneralResponse<PaginatedResponse<MetaPn>>>(
      `${this.apiUrl}/paginated`,
      { params }
    );
  }

  create(data: CreateMetaPnRequest): Observable<GeneralResponse<MetaPn>> {
    return this.http.post<GeneralResponse<MetaPn>>(this.apiUrl, data);
  }

  update(id: number, data: CreateMetaPnRequest): Observable<GeneralResponse<object>> {
    return this.http.put<GeneralResponse<object>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<GeneralResponse<object>> {
    return this.http.delete<GeneralResponse<object>>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<GeneralResponse<MetaPn>> {
    return this.http.get<GeneralResponse<MetaPn>>(`${this.apiUrl}/${id}`);
  }
}
