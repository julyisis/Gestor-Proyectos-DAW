import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell" [class.sidebar-open]="sidebarOpen()">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="brand">
            <div class="brand-icon">GP</div>
            <span class="brand-name">GestorPro</span>
          </div>
          <button class="close-btn" (click)="toggleSidebar()" title="Cerrar menú">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          <a
            routerLink="/proyectos"
            routerLinkActive="active"
            (click)="closeMobile()"
            class="nav-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
            </svg>
            Proyectos
          </a>
          <a
            routerLink="/clientes"
            routerLinkActive="active"
            (click)="closeMobile()"
            class="nav-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zM1.76 16.83C2.93 15.1 4.83 14 7 14c2.17 0 4.07 1.1 5.24 2.83A9.96 9.96 0 017 19c-1.9 0-3.67-.53-5.24-1.17zM16.24 18.83A7.97 7.97 0 0113 19c-.69 0-1.36-.08-2-.24C12.07 17.1 14 15.94 14 14c2.17 0 4.07 1.1 5.24 2.83-.31.12-.63.24-.95.35a7.97 7.97 0 01-2.05.65z"/>
            </svg>
            Clientes
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div class="overlay" (click)="toggleSidebar()"></div>

      <!-- Main content -->
      <div class="main-area">
        <header class="topbar">
          <button class="hamburger" (click)="toggleSidebar()" title="Menú">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
          <div class="topbar-brand">
            <div class="brand-icon-sm">GP</div>
            <span>GestorPro</span>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* ---- Sidebar ---- */
    .sidebar {
      width: 240px;
      background: var(--sidebar-bg, #1e293b);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: transform 0.3s ease;
      z-index: 200;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 12px;
      color: white;
      letter-spacing: -0.5px;
    }

    .brand-name {
      font-weight: 700;
      font-size: 15px;
      color: #e2e8f0;
    }

    .close-btn {
      display: none;
      background: none;
      border: none;
      color: #94a3b8;
      padding: 4px;
      border-radius: 6px;
      cursor: pointer;

      svg { width: 18px; height: 18px; }
      &:hover { background: rgba(255,255,255,0.1); }
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #94a3b8;
      font-weight: 500;
      transition: all 0.15s;
      cursor: pointer;

      svg { width: 18px; height: 18px; flex-shrink: 0; }

      &:hover {
        background: rgba(255,255,255,0.07);
        color: #e2e8f0;
      }

      &.active {
        background: rgba(99, 102, 241, 0.2);
        color: #a5b4fc;
      }
    }

    .sidebar-footer {
      padding: 12px 8px 20px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      background: none;
      border: none;
      border-radius: 8px;
      color: #94a3b8;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s;
      cursor: pointer;

      svg { width: 18px; height: 18px; }
      &:hover { background: rgba(239,68,68,0.15); color: #f87171; }
    }

    /* ---- Overlay ---- */
    .overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 150;
    }

    /* ---- Main area ---- */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .topbar {
      height: 56px;
      background: white;
      border-bottom: 1px solid var(--border, #e2e8f0);
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 12px;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .hamburger {
      display: none;
      background: none;
      border: none;
      color: #64748b;
      padding: 6px;
      border-radius: 8px;
      cursor: pointer;

      svg { width: 20px; height: 20px; display: block; }
      &:hover { background: #f1f5f9; }
    }

    .topbar-brand {
      display: none;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 15px;
      color: #1e293b;
    }

    .brand-icon-sm {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 10px;
      color: white;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    /* ---- Responsive ---- */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        transform: translateX(-100%);
      }

      .app-shell.sidebar-open .sidebar {
        transform: translateX(0);
      }

      .app-shell.sidebar-open .overlay {
        display: block;
      }

      .hamburger { display: flex; }
      .close-btn { display: flex; }
      .topbar-brand { display: flex; }

      .content { padding: 16px; }
    }
  `],
})
export class LayoutComponent {
  sidebarOpen = signal(false);
  private auth = inject(AuthService);

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeMobile() {
    if (window.innerWidth <= 768) this.sidebarOpen.set(false);
  }

  logout() {
    this.auth.logout();
  }
}
