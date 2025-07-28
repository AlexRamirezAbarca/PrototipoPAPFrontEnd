import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreatePoliticaPnRequest, GeneralResponse, PaginatedResponse, PoliticaPn } from "../../../models/politca-pn.models";

@Injectable({
  providedIn: 'root',
})
export class PoliticaPnService {
  private apiUrl = 'http://localhost:5034/api/PoliticaPlanNacionalDesarrollo';

  constructor(private http: HttpClient) {}

  getPaginated(
    page: number,
    pageSize: number,
    filter: string = '',
    filterField: string = ''
  ): Observable<GeneralResponse<PaginatedResponse<PoliticaPn>>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (filter) {
      params = params.set('filter', filter).set('filterField', filterField);
    }

    return this.http.get<GeneralResponse<PaginatedResponse<PoliticaPn>>>(
      `${this.apiUrl}`,
      { params }
    );
  }

  create(data: CreatePoliticaPnRequest): Observable<GeneralResponse<PoliticaPn>> {
    return this.http.post<GeneralResponse<PoliticaPn>>(this.apiUrl, data);
  }

  update(id: number, data: CreatePoliticaPnRequest): Observable<GeneralResponse<object>> {
    return this.http.put<GeneralResponse<object>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<GeneralResponse<object>> {
    return this.http.delete<GeneralResponse<object>>(`${this.apiUrl}/${id}`);
  }
}
