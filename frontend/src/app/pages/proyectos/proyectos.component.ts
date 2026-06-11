import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Proyecto, Cliente } from '../../core/models';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Proyectos</h2>
          <p class="page-subtitle">{{ total() }} proyecto(s) registrado(s)</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportCsv()" title="Exportar CSV">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            CSV
          </button>
          <button class="btn btn-primary" (click)="toggleForm()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
            Nuevo proyecto
          </button>
        </div>
      </div>

      <div class="filters-card">
        <div class="filters-grid">
          <input type="text" [(ngModel)]="filtros.nombre" name="fNombre" placeholder="Buscar por nombre" />
          <select [(ngModel)]="filtros.estado" name="fEstado">
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="BAJA">Baja</option>
          </select>
          <select [(ngModel)]="filtros.sortBy" name="fSortBy">
            <option value="nombreProyecto">Orden: Nombre</option>
            <option value="estado">Orden: Estado</option>
          </select>
          <select [(ngModel)]="filtros.sortOrder" name="fSortOrder">
            <option value="ASC">Ascendente</option>
            <option value="DESC">Descendente</option>
          </select>
        </div>
        <div class="filters-actions">
          <button type="button" class="btn btn-primary" (click)="buscar()">Buscar</button>
          <button type="button" class="btn btn-ghost" (click)="limpiarFiltros()">Limpiar</button>
        </div>
      </div>

      <!-- Form card -->
      @if (showForm()) {
        <div class="form-card">
          <h3>Nuevo proyecto</h3>
          <form (ngSubmit)="crear()" class="create-form">
            <div class="form-group">
              <label>Nombre del proyecto *</label>
              <input type="text" [(ngModel)]="form.nombre" name="nombre" placeholder="Ej: Sistema de facturación" />
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select [(ngModel)]="form.estado" name="estado">
                <option value="ACTIVO">Activo</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cliente (opcional)</label>
              <select [(ngModel)]="form.clienteId" name="clienteId">
                <option [ngValue]="null">Sin cliente</option>
                @for (c of clientes(); track c.id) {
                  <option [ngValue]="c.id">{{ c.nombreCliente }}</option>
                }
              </select>
            </div>
            @if (formError()) {
              <p class="error-text">{{ formError() }}</p>
            }
            <div class="form-actions">
              <button type="button" class="btn btn-ghost" (click)="toggleForm()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="!form.nombre.trim() || creando()">
                @if (creando()) { Guardando... } @else { Guardar proyecto }
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner-lg"></div>
          <p>Cargando proyectos...</p>
        </div>
      }

      <!-- Error -->
      @if (loadError() && !loading()) {
        <div class="alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4a1 1 0 102 0V9a1 1 0 10-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"/>
          </svg>
          {{ loadError() }}
        </div>
      }

      <!-- Grid -->
      @if (!loading() && !loadError()) {
        @if (proyectos().length === 0) {
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/>
            </svg>
            <p>No hay proyectos registrados</p>
            <p class="empty-sub">Crea el primero usando el botón de arriba</p>
          </div>
        } @else {
          <div class="proyectos-grid">
            @for (proyecto of proyectos(); track proyecto.id) {
              <div class="proyecto-card">
                <div class="card-top">
                  <div class="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                    </svg>
                  </div>
                  <span class="badge" [class]="estadoBadge(proyecto.estado)">{{ proyecto.estado }}</span>
                </div>
                <h3 class="card-name">{{ proyecto.nombreProyecto }}</h3>
                <div class="card-meta">
                  @if (proyecto.cliente) {
                    <span class="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm4 6a4 4 0 00-8 0h8z"/>
                      </svg>
                      {{ proyecto.cliente.nombreCliente }}
                    </span>
                  }
                  <span class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                      <path fill-rule="evenodd" d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-1h8a1 1 0 011 1v1H3V4a1 1 0 011-1zm-1 4h10v5a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" clip-rule="evenodd"/>
                    </svg>
                    {{ proyecto.tareas?.length ?? 0 }} tarea(s)
                  </span>
                </div>
                <a [routerLink]="['/proyectos', proyecto.id, 'tareas']" class="btn-kanban">
                  Ver tablero Kanban
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                </a>
              </div>
            }
          </div>

          @if (totalPages() > 1) {
            <div class="pagination">
              <button class="btn btn-ghost btn-sm" (click)="irPagina(page() - 1)" [disabled]="page() <= 1">Anterior</button>
              <span>Página {{ page() }} de {{ totalPages() }}</span>
              <button class="btn btn-ghost btn-sm" (click)="irPagina(page() + 1)" [disabled]="page() >= totalPages()">Siguiente</button>
            </div>
          }
        }
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1100px; margin: 0 auto; }

    .filters-card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 24px; box-shadow: var(--shadow); border: 1px solid #e2e8f0; }
    .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 12px; }
    .filters-actions { display: flex; gap: 8px; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; font-size: 13px; color: #64748b; }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
    .page-subtitle { font-size: 13px; color: #64748b; margin-top: 2px; }

    .header-actions { display: flex; gap: 8px; }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;

      svg { width: 16px; height: 16px; }

      &.btn-primary { background: #6366f1; color: white; &:hover { background: #4f46e5; } }
      &.btn-ghost {
        background: transparent; color: #64748b; border: 1.5px solid #e2e8f0;
        &:hover { background: #f8fafc; }
      }
      &.btn-outline {
        background: transparent; color: #475569; border: 1.5px solid #e2e8f0;
        &:hover { background: #f8fafc; }
      }
      &.btn-sm { padding: 5px 12px; font-size: 12px; }
      &:disabled { opacity: 0.55; cursor: not-allowed; }
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow);
      border: 1px solid #e2e8f0;

      h3 { font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #1e293b; }
    }

    .create-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: start;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
    }

    .error-text { color: #ef4444; font-size: 12px; }

    .form-actions {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      padding-top: 20px;
    }

    .loading-state {
      display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #64748b;
    }
    .spinner-lg {
      width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #6366f1;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .alert-error {
      display: flex; align-items: center; gap: 8px; padding: 12px 16px;
      background: #fee2e2; border: 1px solid #fca5a5; border-radius: 10px;
      color: #b91c1c; font-size: 13px; margin-bottom: 20px;
      svg { width: 16px; height: 16px; flex-shrink: 0; }
    }

    .proyectos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .proyecto-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow);
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.2s, transform 0.2s;

      &:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-icon {
      width: 36px; height: 36px;
      background: #e0e7ff;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #6366f1;
      svg { width: 18px; height: 18px; }
    }

    .badge {
      display: inline-flex;
      padding: 3px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 700;
      &.badge-success { background: #dcfce7; color: #15803d; }
      &.badge-warning { background: #fef3c7; color: #92400e; }
      &.badge-danger { background: #fee2e2; color: #b91c1c; }
    }

    .card-name {
      font-size: 15px; font-weight: 700; color: #1e293b; line-height: 1.3;
    }

    .card-meta {
      display: flex; flex-direction: column; gap: 6px;
    }

    .meta-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #64748b;
      svg { width: 14px; height: 14px; flex-shrink: 0; }
    }

    .btn-kanban {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      color: #6366f1;
      font-size: 13px; font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      margin-top: 4px;
      svg { width: 16px; height: 16px; }

      &:hover { background: #e0e7ff; border-color: #a5b4fc; }
    }

    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 60px 20px; color: #94a3b8;
      background: white; border-radius: 12px; box-shadow: var(--shadow);
      gap: 8px;
      svg { width: 48px; height: 48px; opacity: 0.25; }
      p { font-size: 15px; }
      .empty-sub { font-size: 13px; }
    }
  `],
})
export class ProyectosComponent implements OnInit {
  private api = inject(ApiService);

  proyectos = signal<Proyecto[]>([]);
  clientes = signal<Cliente[]>([]);
  total = signal(0);
  page = signal(1);
  totalPages = signal(0);
  loading = signal(true);
  loadError = signal('');
  showForm = signal(false);
  form = { nombre: '', estado: 'ACTIVO', clienteId: null as number | null };
  filtros = { nombre: '', estado: '', sortBy: 'nombreProyecto', sortOrder: 'ASC' as 'ASC' | 'DESC' };
  creando = signal(false);
  formError = signal('');
  private readonly limit = 9;

  ngOnInit() {
    this.cargar();
    this.api.getClientes({ estado: 'ACTIVO', limit: 100, page: 1 }).subscribe({
      next: (res) => this.clientes.set(res.data),
      error: () => {},
    });
  }

  cargar() {
    this.loading.set(true);
    this.loadError.set('');
    this.api.getProyectos({
      nombre: this.filtros.nombre || undefined,
      estado: this.filtros.estado || undefined,
      sortBy: this.filtros.sortBy,
      sortOrder: this.filtros.sortOrder,
      page: this.page(),
      limit: this.limit,
    }).subscribe({
      next: (res) => {
        this.proyectos.set(res.data);
        this.total.set(res.total);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Error al cargar los proyectos. Verifique que el servidor esté activo.');
        this.loading.set(false);
      },
    });
  }

  buscar() {
    this.page.set(1);
    this.cargar();
  }

  limpiarFiltros() {
    this.filtros = { nombre: '', estado: '', sortBy: 'nombreProyecto', sortOrder: 'ASC' };
    this.page.set(1);
    this.cargar();
  }

  irPagina(nueva: number) {
    if (nueva < 1 || nueva > this.totalPages()) return;
    this.page.set(nueva);
    this.cargar();
  }

  toggleForm() {
    this.showForm.update((v) => !v);
    this.form = { nombre: '', estado: 'ACTIVO', clienteId: null };
    this.formError.set('');
  }

  crear() {
    if (!this.form.nombre.trim()) return;
    this.creando.set(true);
    this.formError.set('');

    const payload: any = {
      nombreProyecto: this.form.nombre.trim(),
      estado: this.form.estado,
    };
    if (this.form.clienteId) payload.clienteId = this.form.clienteId;

    this.api.createProyecto(payload).subscribe({
      next: () => {
        this.toggleForm();
        this.creando.set(false);
        this.cargar();
      },
      error: (e) => {
        this.formError.set(e.error?.message || 'Error al crear el proyecto');
        this.creando.set(false);
      },
    });
  }

  exportCsv() {
    this.api.exportProyectosCsv().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'proyectos.csv';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Error al exportar CSV'),
    });
  }

  estadoBadge(estado: string) {
    if (estado === 'ACTIVO') return 'badge badge-success';
    if (estado === 'FINALIZADO') return 'badge badge-warning';
    return 'badge badge-danger';
  }
}
