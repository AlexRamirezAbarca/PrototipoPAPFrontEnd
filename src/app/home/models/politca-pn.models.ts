export interface PoliticaPn {
  politicaPnId: number;
  nombre: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

export interface CreatePoliticaPnRequest {
  nombre: string;
  descripcion: string;
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
