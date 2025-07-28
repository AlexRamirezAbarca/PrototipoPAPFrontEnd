export interface Objetivo {
  objPnId: number;
  nombre: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface GeneralResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface CreateObjetivoPnRequest {
  nombre: string;
  descripcion: string;
}
