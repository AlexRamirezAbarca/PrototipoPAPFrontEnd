export interface EjePn {
  ejePnId: number;
  nombre: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
}

export interface PaginatedEjePnResponse {
  data: EjePn[];
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

export interface CreateEjePnRequest {
  nombre: string;
  descripcion: string;
}
