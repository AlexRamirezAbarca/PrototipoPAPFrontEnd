import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../../models/login-request.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'auth-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const payload: LoginRequest = this.form.value;

    this.auth.login(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']); // ajusta según tus rutas
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Credenciales inválidas';
      },
    });
  }
}
