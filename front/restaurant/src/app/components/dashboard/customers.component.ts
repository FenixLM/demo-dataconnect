import { Component, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  injectAllCustomers,
  injectCreateCustomer,
  injectUpsertCustomer,
} from 'dataconnect-generated/js/default-connector/angular';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-wrapper">
      <div class="header-actions">
        <h2>Manage Customers</h2>
        <button class="add-button" (click)="showAddForm()">Add Customer</button>
      </div>

      <div class="panel" *ngIf="showForm">
        <h3>{{ editMode ? 'Edit Customer' : 'Add New Customer' }}</h3>
        <form [formGroup]="customerForm" (ngSubmit)="submitForm()">
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="form-control"
              />
              <div
                *ngIf="
                  customerForm.get('firstName')?.invalid &&
                  customerForm.get('firstName')?.touched
                "
                class="error-message"
              >
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="form-control"
              />
              <div
                *ngIf="
                  customerForm.get('lastName')?.invalid &&
                  customerForm.get('lastName')?.touched
                "
                class="error-message"
              >
                Last name is required
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
              />
              <div
                *ngIf="
                  customerForm.get('email')?.invalid &&
                  customerForm.get('email')?.touched
                "
                class="error-message"
              >
                Enter a valid email or leave empty
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                type="text"
                id="phone"
                formControlName="phone"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-button" (click)="cancelForm()">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="customerForm.invalid || isLoading"
            >
              {{ isLoading ? 'Saving...' : 'Save Customer' }}
            </button>
          </div>
        </form>
      </div>

      <div class="table-wrapper">
        <table class="data-table" *ngIf="customers.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let customer of customers">
              <td>{{ customer.firstName }} {{ customer.lastName }}</td>
              <td>{{ customer.email || '-' }}</td>
              <td>{{ customer.phone || '-' }}</td>
              <td class="actions-cell">
                <button
                  class="action-button edit"
                  (click)="editCustomer(customer)"
                >
                  Edit
                </button>
                <button
                  class="action-button delete"
                  (click)="deleteCustomer(customer)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="no-data" *ngIf="customers.length === 0 && !isLoading">
          No customers found. Add a customer to get started.
        </div>

        <div class="loading" *ngIf="isLoading">Loading customers...</div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h2 {
        margin: 0;
        color: #333;
        font-weight: 500;
      }

      .add-button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .add-button:hover {
        background-color: #45a049;
      }

      .panel {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-weight: 500;
        color: #333;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .error-message {
        color: #d32f2f;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .cancel-button {
        background-color: #f1f1f1;
        color: #333;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .cancel-button:hover {
        background-color: #e6e6e6;
      }

      button[type='submit'] {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      button[type='submit']:hover:not(:disabled) {
        background-color: #45a049;
      }

      button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .table-wrapper {
        overflow-x: auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

      .actions-cell {
        display: flex;
        gap: 0.5rem;
      }

      .action-button {
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .action-button.edit {
        background-color: #f8f9fa;
        color: #0275d8;
      }

      .action-button.edit:hover {
        background-color: #e9ecef;
      }

      .action-button.delete {
        background-color: #f8f9fa;
        color: #d9534f;
      }

      .action-button.delete:hover {
        background-color: #e9ecef;
      }

      .no-data {
        text-align: center;
        padding: 2rem 0;
        color: #888;
      }

      .loading {
        text-align: center;
        padding: 2rem 0;
        color: #888;
      }
    `,
  ],
})
export class CustomersComponent {
  cm = injectAllCustomers();
  createCustomerMutation = injectCreateCustomer();
  upsertCustomerMutation = injectUpsertCustomer(); // Añadida mutación para actualizar
  customers: any[] = [];
  customerForm: FormGroup;
  showForm = false;
  editMode = false;
  currentCustomerId: string | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.customerForm = this.createForm();
    this.loadCustomers();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
    });
  }
  loadCustomers() {
    // Set initial loading state
    this.isLoading = true;

    effect(() => {
      // Check if still loading from DataConnect
      const isDataLoading = this.cm.isLoading();

      // Use ChangeDetectorRef to ensure Angular change detection catches all updates
      this.cdr.detectChanges();

      // Update component loading state based on DataConnect loading state
      this.isLoading = isDataLoading;

      if (!isDataLoading) {
        try {
          const data = this.cm.data();
          this.customers = data?.customers || [];
          console.log('Datos cargados nativo:', data);
          // Data is loaded, make sure isLoading is false
          this.isLoading = false;
        } catch (error) {
          if (this.cm.isError()) {
            console.error('Error al cargar los datos:', this.cm.error());
          } else {
            console.error('Error desconocido:', error);
          }
          // Error occurred, make sure isLoading is false
          this.isLoading = false;
        }
      } else {
        console.log('Cargando datos...');
      }
    });
  }

  showAddForm() {
    this.editMode = false;
    this.currentCustomerId = null;
    this.customerForm.reset();
    this.showForm = true;
  }

  editCustomer(customer: any) {
    this.editMode = true;
    this.currentCustomerId = customer.id;
    console.log('Editing customer with ID:', this.currentCustomerId, customer);

    this.customerForm.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email || '',
      phone: customer.phone || '',
    });

    this.showForm = true;
  }

  async deleteCustomer(customer: any) {
    if (
      confirm(
        `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`
      )
    ) {
      try {
        // Delete functionality would be here
        // Since deletion is not in your provided GraphQL mutations, we're just mocking this
        console.log('Delete customer:', customer);

        // Remove from the local array
        this.customers = this.customers.filter((c) => c.id !== customer.id);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  }
  async submitForm() {
    if (this.customerForm.invalid) return;

    this.isLoading = true;

    try {
      const formValue = this.customerForm.value;
      // Preparar datos comunes para ambas operaciones
      const customerData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email || null,
        phone: formValue.phone || null,
      };

      let result;

      if (this.editMode) {
        // Validar ID para actualización
        if (!this.currentCustomerId) {
          console.error('Cannot update customer: Missing ID');
          this.isLoading = false;
          return;
        }

        // Actualizar cliente existente
        console.log(
          'Updating customer:',
          customerData,
          'ID:',
          this.currentCustomerId
        );

        // Añadir ID solo para la operación de actualización
        result = await this.upsertCustomerMutation.mutateAsync({
          id: this.currentCustomerId,
          ...customerData,
        });

        if (result && result.customer_upsert) {
          const updatedCustomerId = result.customer_upsert.id;
          this.updateLocalCustomerList(
            updatedCustomerId,
            customerData,
            this.currentCustomerId
          );
        }
      } else {
        // Crear nuevo cliente
        result = await this.createCustomerMutation.mutateAsync(customerData);

        if (result && result.customer_insert) {
          const newCustomerId = result.customer_insert.id;
          this.updateLocalCustomerList(newCustomerId, customerData);
        }
      }

      this.cancelForm();
    } catch (error) {
      console.error(
        `Error ${this.editMode ? 'updating' : 'creating'} customer:`,
        error
      );
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Actualiza la lista local de clientes después de una operación de creación o actualización
   */
  private updateLocalCustomerList(
    customerId: string,
    customerData: any,
    oldId?: string | null
  ) {
    if (oldId) {
      // Caso de actualización: buscar y actualizar cliente existente
      const index = this.customers.findIndex((c) => c.id === oldId);

      if (index !== -1) {
        this.customers[index] = {
          id: customerId,
          ...customerData,
        };
        console.log('Customer updated in array:', this.customers[index]);
      } else {
        // No se encontró, añadirlo al principio (poco probable)
        this.customers.unshift({
          id: customerId,
          ...customerData,
        });
        console.log('Customer not found in array, added as new:', customerId);
      }
    } else {
      // Caso de creación: añadir nuevo cliente al principio
      this.customers = [{ id: customerId, ...customerData }, ...this.customers];
      console.log('New customer added to array:', customerId);
    }

    // Trigger change detection manually
    this.cdr.detectChanges();
  }

  cancelForm() {
    this.showForm = false;
    this.customerForm.reset();
  }
}
