import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-pages',
  standalone: true,  
  imports: [CommonModule, RouterModule, ReactiveFormsModule],  
  templateUrl: './login-pages.html',
  styleUrls: ['./login-pages.css']
})
export class LoginPages {
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  errorMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.auth.login({
      email: email ?? '',
      password: password ?? '',
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'No se pudo iniciar sesión.';
        this.submitting = false;
      }
    });
  }
}