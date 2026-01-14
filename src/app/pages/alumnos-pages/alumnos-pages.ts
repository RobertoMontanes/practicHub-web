import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminShell } from '../../shared/components/admin-shell/admin-shell';
import { ModalShared } from '../../shared/components/modal-shared/modal-shared';
import { ApiClient } from '../../services/api-client.service';
import { PaginatedResponse, User } from '../../services/api.types';

@Component({
  selector: 'app-alumnos-pages',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, AdminShell, ModalShared], 
  templateUrl: './alumnos-pages.html',
  styleUrl: './alumnos-pages.css',
})
export class AlumnosPages implements OnInit, OnDestroy {
  private api = inject(ApiClient);

  alumnos: User[] = [];
  loading = false;
  saving = false;
  modalOpen = false;
  errorMessage = '';
  successMessage = '';
  private successTimeout: ReturnType<typeof setTimeout> | null = null;

  page = 1;
  perPage = 10;
  lastPage = 1;
  total = 0;

  form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true }),
  });

  editingId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.clearSuccessMessage();
  }

  load(page = 1): void {
    this.loading = true;
    this.page = page;
    this.api.list<User>('users', { page: this.page, per_page: this.perPage }).subscribe({
      next: (res: PaginatedResponse<User>) => {
        this.alumnos = res.data;
        this.lastPage = res.last_page;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los alumnos.';
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    if (this.saving) {
      return;
    }
    this.editingId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset({ name: '', email: '', password: '' });
    this.modalOpen = true;
  }

  openEdit(user: User): void {
    if (this.saving) {
      return;
    }
    this.editingId = user.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.patchValue({ name: user.name, email: user.email, password: '' });
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.saving = false;
  }

  submit(): void {
    if (this.saving) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    const payload: Record<string, unknown> = { ...this.form.getRawValue() };

    if (this.editingId && !payload['password']) {
      delete payload['password'];
    }

    const request = this.editingId
      ? this.api.update<User>('users', this.editingId, payload)
      : this.api.create<User>('users', payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.successMessage = this.editingId
          ? 'El alumno se actualizó correctamente.'
          : 'El alumno se creó correctamente.';
        this.startSuccessTimeout();
        this.load(this.page);
        this.editingId = null;
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'No se pudo guardar el alumno.';
      },
    });
  }

  remove(user: User): void {
    if (this.saving) {
      return;
    }
    if (!confirm(`Eliminar ${user.name}?`)) {
      return;
    }

    this.api.delete('users', user.id).subscribe({
      next: () => this.load(this.page),
      error: () => (this.errorMessage = 'No se pudo eliminar el alumno.'),
    });
  }

  private startSuccessTimeout(): void {
    this.clearSuccessMessage();
    this.successTimeout = setTimeout(() => {
      this.successMessage = '';
      this.successTimeout = null;
    }, 3000);
  }

  private clearSuccessMessage(): void {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = null;
    }
    this.successMessage = '';
  }
}
