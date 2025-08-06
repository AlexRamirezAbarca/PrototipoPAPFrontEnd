import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ObjetivoMetaService {
  private apiUrl = 'http://localhost:5034/api/ObjetivoMetaPn';

  constructor(private http: HttpClient) {}

  crearRelacion(payload: { obj_pn_id: number; meta_pn_id: number }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

   crearMetasConRelacion(payload: {
    objetivoId: number;
    metas: { nombre: string; descripcion?: string }[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/lote-con-relacion`, payload);
  }

}
