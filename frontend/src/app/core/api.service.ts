import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cliente, ClienteSearchParams, PaginatedResult, Proyecto, ProyectoSearchParams, Tarea } from './models';
import { API_BASE } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private buildParams(params?: Record<string, string | number | undefined>): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  getClientes(params?: ClienteSearchParams) {
    return this.http.get<PaginatedResult<Cliente>>(`${API_BASE}/clientes`, {
      params: this.buildParams(params as Record<string, string | number | undefined>),
    });
  }
  createCliente(data: { nombreCliente: string; telefono?: string; email?: string }) {
    return this.http.post<Cliente>(`${API_BASE}/clientes`, data);
  }
  bajaCliente(id: number) {
    return this.http.patch<void>(`${API_BASE}/clientes/baja/${id}`, {});
  }

  getProyectos(params?: ProyectoSearchParams) {
    return this.http.get<PaginatedResult<Proyecto>>(`${API_BASE}/proyectos`, {
      params: this.buildParams(params as Record<string, string | number | undefined>),
    });
  }
  getProyecto(id: number) {
    return this.http.get<Proyecto>(`${API_BASE}/proyectos/${id}`);
  }
  createProyecto(data: { nombreProyecto: string; estado: string; clienteId?: number }) {
    return this.http.post<Proyecto>(`${API_BASE}/proyectos`, data);
  }
  exportProyectosCsv() {
    return this.http.get(`${API_BASE}/proyectos/export/csv`, { responseType: 'blob' });
  }
  bajaProyecto(id: number) {
    return this.http.patch<void>(`${API_BASE}/proyectos/baja/${id}`, {});
  }

  getTareas(idProyecto: number) {
    return this.http.get<Tarea[]>(`${API_BASE}/proyectos/${idProyecto}/tareas`);
  }
  createTarea(idProyecto: number, descripcion: string) {
    return this.http.post<{ id: number }>(`${API_BASE}/proyectos/${idProyecto}/tareas`, {
      descripcion,
    });
  }
  updateTarea(idProyecto: number, id: number, dto: Partial<{ descripcion: string; estado: string }>) {
    return this.http.put<void>(`${API_BASE}/proyectos/${idProyecto}/tareas/${id}`, dto);
  }
  bajaTarea(idProyecto: number, id: number) {
    return this.http.patch<void>(`${API_BASE}/proyectos/${idProyecto}/tareas/baja/${id}`, {});
  }
  exportTareasCsv(idProyecto: number) {
    return this.http.get(`${API_BASE}/proyectos/${idProyecto}/tareas/export/csv`, {
      responseType: 'blob',
    });
  }
}
