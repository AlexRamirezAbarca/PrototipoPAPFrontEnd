// src/app/mock/plan-arbol.mock.ts
import { Eje } from '../models/plan-arbol.model';

export const PLAN_ARBOL_MOCK: Eje[] = [
  {
    ejePnId: 1,
    nombre: 'Eje 1 - Educación',
    objetivos: [
      {
        objPnId: 10,
        nombre: 'Objetivo 1.1',
        metas: [
          { metaPnId: 100, nombre: 'Meta 1.1.1' },
          { metaPnId: 101, nombre: 'Meta 1.1.2' }
        ],
        politicas: [
          { politicaPnId: 200, nombre: 'Política 1.1.1' }
        ]
      }
    ]
  },
  {
    ejePnId: 2,
    nombre: 'Eje 2 - Salud',
    objetivos: [
      {
        objPnId: 20,
        nombre: 'Objetivo 2.1',
        metas: [],
        politicas: [
          { politicaPnId: 201, nombre: 'Política 2.1.1' }
        ]
      }
    ]
  }
];
