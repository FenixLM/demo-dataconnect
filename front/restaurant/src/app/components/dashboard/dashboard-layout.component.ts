import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="logo">
          <h2>Restaurant App</h2>
        </div>
        <nav class="nav-menu">
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Dashboard</a
          >
          <a routerLink="/dashboard/customers" routerLinkActive="active"
            >Customers</a
          >
          <a routerLink="/dashboard/recipes" routerLinkActive="active"
            >Recipes</a
          >
          <a routerLink="/dashboard/orders" routerLinkActive="active">Orders</a>
          <a routerLink="/dashboard/users" routerLinkActive="active">Users</a>
          <a routerLink="/dashboard/roles" routerLinkActive="active">Roles</a>
        </nav>
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </aside>

      <main class="content">
        <header class="header">
          <h1>{{ pageTitle() }}</h1>
          <div class="user-info">
            <span>{{ userName() }}</span>
          </div>
        </header>

        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard {
        display: flex;
        height: 100vh;
        overflow: hidden;
      }

      .sidebar {
        width: 250px;
        background-color: #2c3e50;
        color: white;
        display: flex;
        flex-direction: column;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        z-index: 1;
      }

      .logo {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .logo h2 {
        margin: 0;
        font-size: 1.5rem;
      }

      .nav-menu {
        flex: 1;
        padding: 1rem 0;
      }

      .nav-menu a {
        display: block;
        padding: 0.75rem 1.5rem;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: all 0.2s;
        border-left: 3px solid transparent;
      }

      .nav-menu a:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .nav-menu a.active {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border-left: 3px solid #3498db;
      }

      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .logout-btn {
        width: 100%;
        padding: 0.75rem;
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .logout-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }

      .header h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 500;
        color: #333;
      }

      .user-info {
        display: flex;
        align-items: center;
      }

      .user-info span {
        font-weight: 500;
        color: #555;
      }

      .content-body {
        flex: 1;
        padding: 2rem;
        background-color: #f8f9fa;
        overflow-y: auto;
      }
    `,
  ],
})
export class DashboardLayoutComponent implements OnInit {
  pageTitle = signal<string>('Dashboard');
  userName = signal<string>('User');

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Update page title based on the current route
    this.updatePageTitle(this.router.url);

    // Get user name from authenticated user
    if (this.authService.currentUser?.email) {
      this.userName.set(this.authService.currentUser.email.split('@')[0]);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private updatePageTitle(url: string) {
    if (url.includes('customers')) {
      this.pageTitle.set('Customers');
    } else if (url.includes('recipes')) {
      this.pageTitle.set('Recipes');
    } else if (url.includes('orders')) {
      this.pageTitle.set('Orders');
    } else if (url.includes('users')) {
      this.pageTitle.set('Users');
    } else if (url.includes('roles')) {
      this.pageTitle.set('Roles');
    } else {
      this.pageTitle.set('Dashboard');
    }
  }
}
