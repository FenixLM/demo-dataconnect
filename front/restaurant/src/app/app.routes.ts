import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { DashboardLayoutComponent } from './components/dashboard/dashboard-layout.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home.component';
import { CustomersComponent } from './components/dashboard/customers.component';
import { RecipesComponent } from './components/dashboard/recipes.component';
import { RecipesPublicComponent } from './components/recipes-public.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'recipes', component: RecipesComponent },
      // These routes would be implemented similarly with their respective components
      // { path: 'orders', component: OrdersComponent },
      // { path: 'users', component: UsersComponent },
      // { path: 'roles', component: RolesComponent },
    ],
  },
  { path: 'recipes', component: RecipesPublicComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
