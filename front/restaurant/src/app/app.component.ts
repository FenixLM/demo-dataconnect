import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'restaurant';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Verificar el estado de autenticación al iniciar la aplicación
    this.authService.authState$.subscribe((user) => {
      console.log(
        'Estado de autenticación al iniciar:',
        user ? 'Autenticado' : 'No autenticado'
      );
    });
  }
}
