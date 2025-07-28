export interface Meta {
  metaPnId: number;
  nombre: string;
}

export interface Politica {
  politicaPnId: number;
  nombre: string;
}

export interface Objetivo {
  objPnId: number;
  nombre: string;
  metas: Meta[];
  politicas: Politica[];
}

export interface Eje {
  ejePnId: number;
  nombre: string;
  objetivos: Objetivo[];
}
