import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  allCustomers,
  allUsers,
  allOrders,
  allRecipes,
} from 'dataconnect-generated/js/default-connector';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-grid">
      <!-- Customers Card -->
      <div class="card customers">
        <div class="card-content">
          <h3>Customers</h3>
          <div class="stat">{{ customers }}</div>
          <p>Total registered customers</p>
        </div>
      </div>

      <!-- Recipes Card -->
      <div class="card recipes">
        <div class="card-content">
          <h3>Recipes</h3>
          <div class="stat">{{ recipes }}</div>
          <p>Available recipes</p>
        </div>
      </div>

      <!-- Orders Card -->
      <div class="card orders">
        <div class="card-content">
          <h3>Orders</h3>
          <div class="stat">{{ orders }}</div>
          <p>Total orders placed</p>
        </div>
      </div>

      <!-- Users Card -->
      <div class="card users">
        <div class="card-content">
          <h3>Users</h3>
          <div class="stat">{{ users }}</div>
          <p>Total system users</p>
        </div>
      </div>
    </div>

    <div class="public-recipes-section">
      <a routerLink="/recipes" class="view-public-recipes-button">
        View Public Recipes Page
      </a>
    </div>

    <div class="recent-section">
      <h2>Recent Orders</h2>
      <div class="table-wrapper">
        <table
          class="data-table"
          *ngIf="recentOrders && recentOrders.length > 0"
        >
          <thead>
            <tr>
              <th>Customer</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of recentOrders">
              <td>
                {{ order.customer.firstName }} {{ order.customer.lastName }}
              </td>
              <td>
                <span [class]="'status ' + order.status.toLowerCase()">
                  {{ order.status }}
                </span>
              </td>
              <td>{{ formatDate(order.orderDate) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="no-data" *ngIf="!recentOrders || recentOrders.length === 0">
          No recent orders found
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
      }

      .card-content {
        padding: 1.5rem;
      }

      .customers {
        border-top: 4px solid #3498db;
      }

      .recipes {
        border-top: 4px solid #2ecc71;
      }

      .orders {
        border-top: 4px solid #f39c12;
      }

      .users {
        border-top: 4px solid #9b59b6;
      }

      .stat {
        font-size: 2.5rem;
        font-weight: 600;
        margin: 1rem 0;
        color: #333;
      }

      h3 {
        margin: 0;
        color: #555;
        font-weight: 500;
      }

      p {
        margin: 0;
        color: #888;
        font-size: 0.9rem;
      }

      .recent-section {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
      }

      .recent-section h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-weight: 500;
        color: #333;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      .data-table th,
      .data-table td {
        padding: 0.75rem 1rem;
        text-align: left;
      }

      .data-table th {
        background-color: #f8f9fa;
        font-weight: 500;
        color: #555;
        border-bottom: 1px solid #dee2e6;
      }

      .data-table tr {
        border-bottom: 1px solid #f0f0f0;
      }

      .data-table tr:last-child {
        border-bottom: none;
      }

      .status {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status.pending {
        background-color: #fff3cd;
        color: #856404;
      }

      .status.completed {
        background-color: #d4edda;
        color: #155724;
      }

      .status.cancelled {
        background-color: #f8d7da;
        color: #721c24;
      }

      .status.processing {
        background-color: #cce5ff;
        color: #004085;
      }
      .no-data {
        text-align: center;
        padding: 2rem 0;
        color: #888;
      }

      .public-recipes-section {
        display: flex;
        justify-content: center;
        margin: 1.5rem 0;
      }

      .view-public-recipes-button {
        display: inline-block;
        background-color: #3498db;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: background-color 0.2s;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
      }

      .view-public-recipes-button:hover {
        background-color: #2980b9;
      }

      .recent-section {
        margin-top: 1.5rem;
      }

      .loading-indicator {
        text-align: center;
        padding: 2rem 0;
        color: #3498db;
      }

      .error-message {
        text-align: center;
        padding: 2rem 0;
        color: #e74c3c;
      }

      .stat.loading {
        color: #3498db;
        font-size: 1.5rem;
      }
      .stat.error {
        color: #e74c3c;
      }

      /* JSON formatting styles */
      .stat pre {
        max-height: 200px;
        overflow: auto;
        font-size: 0.75rem;
        background-color: #f8f9fa;
        border: 1px solid #eee;
        padding: 0.5rem;
        border-radius: 4px;
        text-align: left;
        white-space: pre-wrap;
        word-break: break-all;
      }
    `,
  ],
})
export class DashboardHomeComponent {
  // Numeric properties for counters
  customers = 0;
  recipes = 0;
  orders = 0;
  users = 0;
  recentOrders: any[] = [];
  constructor() {
    // Fetch data when component initializes
    this.fetchData();
  }

  fetchData() {
    allCustomers()
      .then((res) => {
        this.customers = res.data.customers.length;
      })
      .catch(() => []);

    allRecipes()
      .then((res) => {
        this.recipes = res.data.recipes.length;
      })
      .catch(() => []);

    allOrders()
      .then((res) => {
        this.orders = res.data.orders.length;

        // Update recent orders data
        if (res.data && res.data.orders) {
          this.recentOrders = this.getRecentOrders(res.data.orders);
        }
      })
      .catch(() => []);

    allUsers()
      .then((res) => {
        this.users = res.data.users.length;
        console.log('Users:', res.data.users);
      })
      .catch(() => []);
  }

  /**
   * Gets the 5 most recent orders sorted by date
   */
  getRecentOrders(orders: any[]): any[] {
    if (!orders) return [];

    return Array.from(orders)
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )
      .slice(0, 5);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
