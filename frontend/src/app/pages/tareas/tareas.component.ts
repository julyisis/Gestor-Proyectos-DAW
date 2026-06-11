import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Tarea, Proyecto } from '../../core/models';

type EstadoTarea = 'PENDIENTE' | 'FINALIZADO' | 'BAJA';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/proyectos" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
            </svg>
            Proyectos
          </a>
          <div class="header-info">
            <h2 class="page-title">
              {{ proyecto()?.nombreProyecto ?? 'Tablero Kanban' }}
            </h2>
            @if (proyecto()?.cliente) {
              <span class="client-tag">{{ proyecto()!.cliente!.nombreCliente }}</span>
            }
          </div>
        </div>
        <div class="header-right">
          <span class="tasks-count">{{ tareas().length }} tarea(s)</span>
          <button class="btn btn-outline" (click)="exportCsv()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            CSV
          </button>
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner-lg"></div>
          <p>Cargando tablero...</p>
        </div>
      }

      <!-- Error -->
      @if (loadError() && !loading()) {
        <div class="alert-error">{{ loadError() }}</div>
      }

      <!-- Kanban board -->
      @if (!loading() && !loadError()) {
        <div class="kanban-board">

          <!-- PENDIENTE -->
          <div
            class="kanban-col"
            [class.drag-over]="dragOverCol() === 'PENDIENTE'"
            (dragover)="onDragOver($event, 'PENDIENTE')"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event, 'PENDIENTE')"
          >
            <div class="col-header pendiente-header">
              <div class="col-title">
                <span class="col-dot"></span>
                <span>Pendiente</span>
              </div>
              <span class="col-count">{{ tareasPendiente().length }}</span>
            </div>

            <div class="col-body">
              @for (tarea of tareasPendiente(); track tarea.id) {
                <div
                  class="tarea-card"
                  draggable="true"
                  (dragstart)="onDragStart($event, tarea)"
                  (dragend)="onDragEnd()"
                  [class.dragging]="dragging()?.id === tarea.id"
                >
                  <div class="card-header">
                    <span class="card-id">#{{ tarea.id }}</span>
                    <div class="card-btns">
                      <button
                        class="action-btn success"
                        title="Finalizar"
                        (click)="cambiarEstado(tarea, 'FINALIZADO')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                          <path fill-rule="evenodd" d="M13.707 3.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L6 9.586l6.293-6.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </button>
                      <button
                        class="action-btn danger"
                        title="Dar de baja"
                        (click)="cambiarEstado(tarea, 'BAJA')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="card-desc">{{ tarea.descripcion }}</p>
                  <div class="drag-hint">Arrastrar para mover</div>
                </div>
              }

              <!-- Add task form / button -->
              @if (showAddForm()) {
                <div class="add-form">
                  <textarea
                    [(ngModel)]="newDesc"
                    name="newDesc"
                    placeholder="Descripción de la tarea..."
                    rows="3"
                    (keydown.enter)="onEnterKey($event)"
                  ></textarea>
                  <div class="add-form-btns">
                    <button class="btn-add-cancel" (click)="showAddForm.set(false); newDesc = ''">
                      Cancelar
                    </button>
                    <button
                      class="btn-add-save"
                      (click)="agregarTarea()"
                      [disabled]="!newDesc.trim() || guardandoTarea()"
                    >
                      {{ guardandoTarea() ? 'Guardando...' : 'Agregar' }}
                    </button>
                  </div>
                </div>
              } @else {
                <button class="btn-add-task" (click)="showAddForm.set(true)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                  </svg>
                  Agregar tarea
                </button>
              }
            </div>
          </div>

          <!-- FINALIZADO -->
          <div
            class="kanban-col"
            [class.drag-over]="dragOverCol() === 'FINALIZADO'"
            (dragover)="onDragOver($event, 'FINALIZADO')"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event, 'FINALIZADO')"
          >
            <div class="col-header finalizado-header">
              <div class="col-title">
                <span class="col-dot"></span>
                <span>Finalizado</span>
              </div>
              <span class="col-count">{{ tareasFinalizadas().length }}</span>
            </div>
            <div class="col-body">
              @for (tarea of tareasFinalizadas(); track tarea.id) {
                <div
                  class="tarea-card done"
                  draggable="true"
                  (dragstart)="onDragStart($event, tarea)"
                  (dragend)="onDragEnd()"
                  [class.dragging]="dragging()?.id === tarea.id"
                >
                  <div class="card-header">
                    <span class="card-id">#{{ tarea.id }}</span>
                    <div class="card-btns">
                      <button
                        class="action-btn warning"
                        title="Reactivar"
                        (click)="cambiarEstado(tarea, 'PENDIENTE')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                          <path fill-rule="evenodd" d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.417A6 6 0 118 2v1z" clip-rule="evenodd"/>
                          <path d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z"/>
                        </svg>
                      </button>
                      <button
                        class="action-btn danger"
                        title="Dar de baja"
                        (click)="cambiarEstado(tarea, 'BAJA')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="card-desc">{{ tarea.descripcion }}</p>
                  <div class="drag-hint">Arrastrar para mover</div>
                </div>
              }
              @if (tareasFinalizadas().length === 0) {
                <div class="col-empty">Sin tareas finalizadas</div>
              }
            </div>
          </div>

          <!-- BAJA -->
          <div
            class="kanban-col"
            [class.drag-over]="dragOverCol() === 'BAJA'"
            (dragover)="onDragOver($event, 'BAJA')"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event, 'BAJA')"
          >
            <div class="col-header baja-header">
              <div class="col-title">
                <span class="col-dot"></span>
                <span>Baja</span>
              </div>
              <span class="col-count">{{ tareasBaja().length }}</span>
            </div>
            <div class="col-body">
              @for (tarea of tareasBaja(); track tarea.id) {
                <div
                  class="tarea-card archived"
                  draggable="true"
                  (dragstart)="onDragStart($event, tarea)"
                  (dragend)="onDragEnd()"
                  [class.dragging]="dragging()?.id === tarea.id"
                >
                  <div class="card-header">
                    <span class="card-id">#{{ tarea.id }}</span>
                    <div class="card-btns">
                      <button
                        class="action-btn warning"
                        title="Reactivar"
                        (click)="cambiarEstado(tarea, 'PENDIENTE')"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                          <path fill-rule="evenodd" d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.417A6 6 0 118 2v1z" clip-rule="evenodd"/>
                          <path d="M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="card-desc">{{ tarea.descripcion }}</p>
                  <div class="drag-hint">Arrastrar para mover</div>
                </div>
              }
              @if (tareasBaja().length === 0) {
                <div class="col-empty">Sin tareas dadas de baja</div>
              }
            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    /* ---- Header ---- */
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 16px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .header-left { display: flex; flex-direction: column; gap: 8px; }

    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; color: #6366f1; font-weight: 500;
      cursor: pointer; transition: gap 0.15s;
      svg { width: 14px; height: 14px; }
      &:hover { gap: 8px; }
    }

    .header-info { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    .page-title { font-size: 22px; font-weight: 700; color: #1e293b; }

    .client-tag {
      background: #e0e7ff; color: #4338ca;
      padding: 3px 10px; border-radius: 99px;
      font-size: 12px; font-weight: 600;
    }

    .header-right { display: flex; align-items: center; gap: 12px; }

    .tasks-count { font-size: 13px; color: #64748b; }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border: none; border-radius: 8px;
      font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
      svg { width: 15px; height: 15px; }

      &.btn-outline {
        background: transparent; color: #475569; border: 1.5px solid #e2e8f0;
        &:hover { background: #f8fafc; }
      }
    }

    /* ---- States ---- */
    .loading-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 60px; color: #64748b;
    }
    .spinner-lg {
      width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #6366f1;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .alert-error {
      padding: 12px 16px; background: #fee2e2; border: 1px solid #fca5a5;
      border-radius: 10px; color: #b91c1c; font-size: 13px;
    }

    /* ---- Kanban board ---- */
    .kanban-board {
      display: flex;
      gap: 16px;
      flex: 1;
      min-height: 0;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    /* ---- Column ---- */
    .kanban-col {
      flex: 0 0 300px;
      display: flex;
      flex-direction: column;
      background: #f8fafc;
      border-radius: 12px;
      border: 2px solid transparent;
      transition: border-color 0.15s, background 0.15s;
      overflow: hidden;

      &.drag-over {
        border-color: #6366f1;
        background: #eef2ff;
      }
    }

    .col-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px 12px;
      font-weight: 700;
      font-size: 13px;
      flex-shrink: 0;
    }

    .col-title {
      display: flex; align-items: center; gap: 8px;
    }

    .col-dot {
      width: 10px; height: 10px; border-radius: 50%;
    }

    .col-count {
      min-width: 24px; height: 22px; padding: 0 6px;
      border-radius: 99px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      background: rgba(255,255,255,0.7);
    }

    .pendiente-header {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #78350f;
      .col-dot { background: #f59e0b; }
    }

    .finalizado-header {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #14532d;
      .col-dot { background: #22c55e; }
    }

    .baja-header {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #7f1d1d;
      .col-dot { background: #ef4444; }
    }

    .col-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .col-empty {
      text-align: center; padding: 24px 12px;
      color: #94a3b8; font-size: 12px; font-style: italic;
    }

    /* ---- Task card ---- */
    .tarea-card {
      background: white;
      border-radius: 10px;
      padding: 12px 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border: 1.5px solid #f1f5f9;
      cursor: grab;
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-2px);
        .drag-hint { opacity: 1; }
      }

      &:active { cursor: grabbing; }

      &.done { opacity: 0.85; }

      &.archived {
        opacity: 0.65;
        .card-desc { text-decoration: line-through; color: #94a3b8; }
      }

      &.dragging { opacity: 0.4; transform: rotate(2deg); }
    }

    .card-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 6px;
    }

    .card-id {
      font-size: 11px; font-weight: 700; color: #94a3b8;
      background: #f8fafc; padding: 2px 6px; border-radius: 4px;
    }

    .card-btns { display: flex; gap: 4px; }

    .action-btn {
      width: 24px; height: 24px; border: none; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.15s;
      svg { width: 12px; height: 12px; }

      &.success { background: #dcfce7; color: #16a34a; &:hover { background: #22c55e; color: white; } }
      &.danger { background: #fee2e2; color: #dc2626; &:hover { background: #ef4444; color: white; } }
      &.warning { background: #fef3c7; color: #d97706; &:hover { background: #f59e0b; color: white; } }
    }

    .card-desc {
      font-size: 13px; color: #334155; line-height: 1.5;
      word-break: break-word;
    }

    .drag-hint {
      font-size: 10px; color: #94a3b8; text-align: center;
      margin-top: 8px; opacity: 0; transition: opacity 0.15s;
    }

    /* ---- Add form ---- */
    .add-form {
      background: white;
      border: 2px solid #6366f1;
      border-radius: 10px;
      padding: 10px;
      display: flex; flex-direction: column; gap: 8px;

      textarea {
        resize: none; font-size: 13px; padding: 8px; border-radius: 6px;
        border: 1px solid #e2e8f0; font-family: inherit;
        &:focus { border-color: #6366f1; box-shadow: 0 0 0 2px #e0e7ff; outline: none; }
      }
    }

    .add-form-btns { display: flex; gap: 6px; justify-content: flex-end; }

    .btn-add-cancel {
      padding: 5px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
      background: transparent; color: #64748b; font-size: 12px; font-weight: 500; cursor: pointer;
      &:hover { background: #f8fafc; }
    }

    .btn-add-save {
      padding: 5px 12px; border: none; border-radius: 6px;
      background: #6366f1; color: white; font-size: 12px; font-weight: 600; cursor: pointer;
      &:hover { background: #4f46e5; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .btn-add-task {
      display: flex; align-items: center; gap: 6px;
      width: 100%; padding: 8px 10px;
      background: transparent; border: 1.5px dashed #cbd5e1; border-radius: 8px;
      color: #94a3b8; font-size: 12px; font-weight: 500; cursor: pointer;
      transition: all 0.15s;
      svg { width: 14px; height: 14px; }
      &:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
    }

    /* ---- Responsive ---- */
    @media (max-width: 900px) {
      .kanban-board {
        flex-direction: column;
        height: auto;
        overflow-x: visible;
      }
      .kanban-col { flex: none; width: 100%; }
    }
  `],
})
export class TareasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  proyectoId = signal(0);
  proyecto = signal<Proyecto | null>(null);
  tareas = signal<Tarea[]>([]);
  loading = signal(true);
  loadError = signal('');

  showAddForm = signal(false);
  newDesc = '';
  guardandoTarea = signal(false);

  dragging = signal<Tarea | null>(null);
  dragOverCol = signal<EstadoTarea | null>(null);

  tareasPendiente = computed(() => this.tareas().filter((t) => t.estado === 'PENDIENTE'));
  tareasFinalizadas = computed(() => this.tareas().filter((t) => t.estado === 'FINALIZADO'));
  tareasBaja = computed(() => this.tareas().filter((t) => t.estado === 'BAJA'));

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.proyectoId.set(+params['id']);
      this.cargar();
    });
  }

  cargar() {
    this.loading.set(true);
    this.loadError.set('');

    this.api.getProyecto(this.proyectoId()).subscribe({
      next: (p) => this.proyecto.set(p),
      error: () => {},
    });

    this.api.getTareas(this.proyectoId()).subscribe({
      next: (tareas) => {
        this.tareas.set(tareas);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Error al cargar las tareas. Verifique que el servidor esté activo.');
        this.loading.set(false);
      },
    });
  }

  // ---- Drag & Drop ----
  onDragStart(event: DragEvent, tarea: Tarea) {
    this.dragging.set(tarea);
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('tareaId', String(tarea.id));
  }

  onDragEnd() {
    this.dragging.set(null);
    this.dragOverCol.set(null);
  }

  onDragOver(event: DragEvent, estado: EstadoTarea) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverCol.set(estado);
  }

  onDragLeave() {
    this.dragOverCol.set(null);
  }

  onDrop(event: DragEvent, nuevoEstado: EstadoTarea) {
    event.preventDefault();
    this.dragOverCol.set(null);
    const tarea = this.dragging();
    if (!tarea || tarea.estado === nuevoEstado) return;
    this.cambiarEstado(tarea, nuevoEstado);
  }

  // ---- Actions ----
  cambiarEstado(tarea: Tarea, nuevoEstado: EstadoTarea) {
    const req =
      nuevoEstado === 'BAJA'
        ? this.api.bajaTarea(this.proyectoId(), tarea.id)
        : this.api.updateTarea(this.proyectoId(), tarea.id, { estado: nuevoEstado });

    req.subscribe({
      next: () => {
        this.tareas.update((list) =>
          list.map((t) => (t.id === tarea.id ? { ...t, estado: nuevoEstado } : t)),
        );
      },
      error: (e) => {
        alert(e.error?.message || 'Error al actualizar la tarea');
      },
    });
  }

  agregarTarea() {
    if (!this.newDesc.trim()) return;
    this.guardandoTarea.set(true);
    this.api.createTarea(this.proyectoId(), this.newDesc.trim()).subscribe({
      next: (res) => {
        const nueva: Tarea = {
          id: res.id,
          descripcion: this.newDesc.trim(),
          estado: 'PENDIENTE',
          idProyecto: this.proyectoId(),
        };
        this.tareas.update((list) => [...list, nueva]);
        this.newDesc = '';
        this.showAddForm.set(false);
        this.guardandoTarea.set(false);
      },
      error: (e) => {
        alert(e.error?.message || 'Error al crear la tarea');
        this.guardandoTarea.set(false);
      },
    });
  }

  onEnterKey(event: Event) {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      event.preventDefault();
      this.agregarTarea();
    }
  }

  exportCsv() {
    this.api.exportTareasCsv(this.proyectoId()).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tareas-proyecto-${this.proyectoId()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Error al exportar CSV'),
    });
  }
}
