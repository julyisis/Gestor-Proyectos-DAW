import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Cliente } from '../../core/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 class="page-title">Clientes</h2>
          <p class="page-subtitle">{{ total() }} cliente(s) registrado(s)</p>
        </div>
        <button class="btn btn-primary" (click)="toggleForm()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
          </svg>
          Nuevo cliente
        </button>
      </div>

      <div class="filters-card">
        <div class="filters-grid">
          <input type="text" [(ngModel)]="filtros.nombre" name="fNombre" placeholder="Buscar por nombre" />
          <input type="text" [(ngModel)]="filtros.telefono" name="fTelefono" placeholder="Teléfono" />
          <input type="text" [(ngModel)]="filtros.email" name="fEmail" placeholder="Email" />
          <select [(ngModel)]="filtros.estado" name="fEstado">
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="BAJA">Baja</option>
          </select>
          <select [(ngModel)]="filtros.sortBy" name="fSortBy">
            <option value="nombreCliente">Orden: Nombre</option>
            <option value="estado">Orden: Estado</option>
            <option value="telefono">Orden: Teléfono</option>
            <option value="email">Orden: Email</option>
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

      @if (showForm()) {
        <div class="form-card">
          <h3>Nuevo cliente</h3>
          <form (ngSubmit)="crear()" class="create-form">
            <input type="text" [(ngModel)]="form.nombreCliente" name="nombre" placeholder="Nombre del cliente" required />
            <input type="text" [(ngModel)]="form.telefono" name="telefono" placeholder="Teléfono" />
            <input type="email" [(ngModel)]="form.email" name="email" placeholder="Email" />
            <div class="form-actions">
              <button type="button" class="btn btn-ghost" (click)="toggleForm()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="!form.nombreCliente.trim() || creando()">
                @if (creando()) { Guardando... } @else { Guardar }
              </button>
            </div>
          </form>
          @if (formError()) {
            <p class="error-text">{{ formError() }}</p>
          }
        </div>
      }

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner-lg"></div>
          <p>Cargando clientes...</p>
        </div>
      }

      @if (loadError() && !loading()) {
        <div class="alert-error">{{ loadError() }}</div>
      }

      @if (!loading() && !loadError()) {
        @if (clientes().length === 0) {
          <div class="empty-state">
            <p>No hay clientes con esos criterios</p>
          </div>
        } @else {
          <div class="table-card">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Proyectos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (cliente of clientes(); track cliente.id) {
                  <tr>
                    <td class="text-muted">{{ cliente.id }}</td>
                    <td class="font-medium">{{ cliente.nombreCliente }}</td>
                    <td class="text-muted">{{ cliente.telefono || '—' }}</td>
                    <td class="text-muted">{{ cliente.email || '—' }}</td>
                    <td>
                      <span class="badge" [class]="estadoBadge(cliente.estado)">{{ cliente.estado }}</span>
                    </td>
                    <td class="text-muted">{{ cliente.proyectos?.length ?? 0 }}</td>
                    <td>
                      @if (cliente.estado === 'ACTIVO') {
                        <button class="btn btn-sm btn-danger-outline" (click)="darBaja(cliente)" [disabled]="darandoBaja() === cliente.id">
                          {{ darandoBaja() === cliente.id ? 'Procesando...' : 'Dar de baja' }}
                        </button>
                      } @else {
                        <span class="text-muted italic">Inactivo</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
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
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .page-title { font-size: 22px; font-weight: 700; color: #1e293b; }
    .page-subtitle { font-size: 13px; color: #64748b; margin-top: 2px; }
    .filters-card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-shadow: var(--shadow); border: 1px solid #e2e8f0; }
    .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 12px; }
    .filters-actions { display: flex; gap: 8px; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; svg { width: 16px; height: 16px; } &.btn-primary { background: #6366f1; color: white; &:hover { background: #4f46e5; } } &.btn-ghost { background: transparent; color: #64748b; border: 1.5px solid #e2e8f0; &:hover { background: #f8fafc; } } &.btn-sm { padding: 5px 12px; font-size: 12px; } &.btn-danger-outline { background: transparent; color: #ef4444; border: 1.5px solid #fca5a5; padding: 5px 12px; font-size: 12px; &:hover { background: #fee2e2; } } &:disabled { opacity: 0.55; cursor: not-allowed; } }
    .form-card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow); border: 1px solid #e2e8f0; h3 { font-size: 15px; font-weight: 600; margin-bottom: 14px; color: #1e293b; } }
    .create-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; align-items: end; }
    .form-actions { display: flex; gap: 8px; }
    .error-text { color: #ef4444; font-size: 12px; margin-top: 8px; }
    .loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #64748b; }
    .spinner-lg { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .alert-error { padding: 12px 16px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 10px; color: #b91c1c; font-size: 13px; margin-bottom: 20px; }
    .table-card { background: white; border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; border: 1px solid #e2e8f0; }
    .table { width: 100%; border-collapse: collapse; th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; } td { padding: 13px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; } tr:last-child td { border-bottom: none; } tr:hover td { background: #fafbfc; } }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; &.badge-success { background: #dcfce7; color: #15803d; } &.badge-danger { background: #fee2e2; color: #b91c1c; } }
    .text-muted { color: #94a3b8; }
    .font-medium { font-weight: 600; }
    .italic { font-style: italic; font-size: 12px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; background: white; border-radius: 12px; box-shadow: var(--shadow); }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; font-size: 13px; color: #64748b; }
    @media (max-width: 600px) { .page-header { flex-direction: column; } }
  `],
})
export class ClientesComponent implements OnInit {
  private api = inject(ApiService);

  clientes = signal<Cliente[]>([]);
  total = signal(0);
  page = signal(1);
  totalPages = signal(0);
  loading = signal(true);
  loadError = signal('');
  showForm = signal(false);
  form = { nombreCliente: '', telefono: '', email: '' };
  filtros = { nombre: '', telefono: '', email: '', estado: '', sortBy: 'nombreCliente', sortOrder: 'ASC' as 'ASC' | 'DESC' };
  creando = signal(false);
  formError = signal('');
  darandoBaja = signal<number | null>(null);
  private readonly limit = 10;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.loadError.set('');
    this.api.getClientes({
      nombre: this.filtros.nombre || undefined,
      telefono: this.filtros.telefono || undefined,
      email: this.filtros.email || undefined,
      estado: this.filtros.estado || undefined,
      sortBy: this.filtros.sortBy,
      sortOrder: this.filtros.sortOrder,
      page: this.page(),
      limit: this.limit,
    }).subscribe({
      next: (res) => {
        this.clientes.set(res.data);
        this.total.set(res.total);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Error al cargar los clientes. Verifique que el servidor esté activo.');
        this.loading.set(false);
      },
    });
  }

  buscar() {
    this.page.set(1);
    this.cargar();
  }

  limpiarFiltros() {
    this.filtros = { nombre: '', telefono: '', email: '', estado: '', sortBy: 'nombreCliente', sortOrder: 'ASC' };
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
    this.form = { nombreCliente: '', telefono: '', email: '' };
    this.formError.set('');
  }

  crear() {
    if (!this.form.nombreCliente.trim()) return;
    this.creando.set(true);
    this.formError.set('');
    const payload: { nombreCliente: string; telefono?: string; email?: string } = {
      nombreCliente: this.form.nombreCliente.trim(),
    };
    if (this.form.telefono.trim()) payload.telefono = this.form.telefono.trim();
    if (this.form.email.trim()) payload.email = this.form.email.trim();

    this.api.createCliente(payload).subscribe({
      next: () => {
        this.toggleForm();
        this.creando.set(false);
        this.cargar();
      },
      error: (e) => {
        this.formError.set(e.error?.message || 'Error al crear el cliente');
        this.creando.set(false);
      },
    });
  }

  darBaja(cliente: Cliente) {
    if (!confirm(`¿Dar de baja a "${cliente.nombreCliente}"?`)) return;
    this.darandoBaja.set(cliente.id);
    this.api.bajaCliente(cliente.id).subscribe({
      next: () => {
        this.darandoBaja.set(null);
        this.cargar();
      },
      error: (e) => {
        alert(e.error?.message || 'Error al dar de baja');
        this.darandoBaja.set(null);
      },
    });
  }

  estadoBadge(estado: string) {
    return estado === 'ACTIVO' ? 'badge badge-success' : 'badge badge-danger';
  }
}
