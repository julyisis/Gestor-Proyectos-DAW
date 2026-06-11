export interface LoginResponse {
  access_token: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Cliente {
  id: number;
  nombreCliente: string;
  telefono?: string;
  email?: string;
  estado: 'ACTIVO' | 'BAJA';
  proyectos?: Proyecto[];
}

export interface ClienteSearchParams {
  nombre?: string;
  estado?: string;
  telefono?: string;
  email?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface ProyectoSearchParams {
  nombre?: string;
  estado?: string;
  clienteId?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface Proyecto {
  id: number;
  nombreProyecto: string;
  estado: 'ACTIVO' | 'FINALIZADO' | 'BAJA';
  cliente?: Cliente;
  tareas?: Tarea[];
}

export interface Tarea {
  id: number;
  descripcion: string;
  estado: 'PENDIENTE' | 'FINALIZADO' | 'BAJA';
  idProyecto: number;
  proyecto?: Proyecto;
}
