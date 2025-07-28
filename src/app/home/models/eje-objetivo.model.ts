export interface Meta {
  metaPnId: number;
  nombre: string;
  descripcion: string;
}

export interface Politica {
  politicaPnId: number;
  nombre: string;
  descripcion: string;
}

export interface Objetivo {
  objPnId: number;
  nombre: string;
  descripcion: string;
  metas: Meta[];
  politicas: Politica[];
}

export interface Eje {
  ejePnId: number;
  nombre: string;
  descripcion: string;
}

export interface EjeObjetivoRelacion {
  ejeObjetivoPnId: number;
  estado: string;
  fechaCreacion: string;
  eje: Eje;
  objetivo: Objetivo;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
