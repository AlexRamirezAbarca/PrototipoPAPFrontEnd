import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ObjetivoPoliticaService {
  private apiUrl = 'http://localhost:5034/api/ObjetivoPolitica';

  constructor(private http: HttpClient) {}

  crearRelacion(payload: { ObjPnId: number; PoliticaPnId: number }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  crearPoliticasConRelacion(payload: {
    objetivoId: number;
    politicas: { nombre: string; descripcion?: string }[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/lote-con-relacion`, payload);
  }



}
