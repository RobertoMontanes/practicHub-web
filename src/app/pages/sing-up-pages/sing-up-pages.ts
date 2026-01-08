import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sing-up-pages',
  standalone: true,  
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './sing-up-pages.html',
  styleUrls: ['./sing-up-pages.css'],
})
export class SingUpPages {
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  errorMessage = '';

  private passwordsMatchValidator: ValidatorFn = (group) => {
    const password = group.get('password')?.value;
    const confirmation = group.get('password_confirmation')?.value;
    return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
  };

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password_confirmation: new FormControl('', [Validators.required]),
  }, { validators: this.passwordsMatchValidator });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const { name, email, password, password_confirmation } = this.registerForm.value;

    this.auth.register({
      name: name ?? '',
      email: email ?? '',
      password: password ?? '',
      password_confirmation: password_confirmation ?? '',
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'No se pudo completar el registro.';
        this.submitting = false;
      }
    });
  }

}
