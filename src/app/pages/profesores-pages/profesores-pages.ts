import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminShell } from '../../shared/components/admin-shell/admin-shell';
import { ModalShared } from '../../shared/components/modal-shared/modal-shared';
import { ApiClient } from '../../services/api-client.service';
import { PaginatedResponse, Profesor, User } from '../../services/api.types';

@Component({
  selector: 'app-profesores-pages',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, AdminShell, ModalShared], 
  templateUrl: './profesores-pages.html',
  styleUrl: './profesores-pages.css',
})
export class ProfesoresPages implements OnInit {
  private api = inject(ApiClient);

  profesores: Profesor[] = [];
  users: User[] = [];
  loading = false;
  saving = false;
  modalOpen = false;
  errorMessage = '';

  page = 1;
  perPage = 10;
  lastPage = 1;
  total = 0;

  form = new FormGroup({
    user_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    dni: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    departamento: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    especialidad: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    telefono: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    activo: new FormControl<boolean>(true, { nonNullable: true }),
  });

  editingId: number | null = null;

  ngOnInit(): void {
    this.load();
    this.loadUsers();
  }

  load(page = 1): void {
    this.loading = true;
    this.page = page;
    this.api.list<Profesor>('profesores', { page: this.page, per_page: this.perPage }).subscribe({
      next: (res: PaginatedResponse<Profesor>) => {
        this.profesores = res.data;
        this.lastPage = res.last_page;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los profesores.';
        this.loading = false;
      },
    });
  }

  loadUsers(): void {
    this.api.list<User>('users', { per_page: 100 }).subscribe({
      next: (res) => (this.users = res.data),
      error: () => {
        this.users = [];
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.form.reset({
      user_id: null,
      dni: '',
      departamento: '',
      especialidad: '',
      telefono: '',
      activo: true,
    });
    this.modalOpen = true;
  }

  openEdit(profesor: Profesor): void {
    this.editingId = profesor.id;
    this.errorMessage = '';
    this.form.patchValue({
      user_id: profesor.user_id,
      dni: profesor.dni,
      departamento: profesor.departamento,
      especialidad: profesor.especialidad,
      telefono: profesor.telefono,
      activo: profesor.activo ?? true,
    });
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.saving = false;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.form.getRawValue();

    const request = this.editingId
      ? this.api.update<Profesor>('profesores', this.editingId, payload)
      : this.api.create<Profesor>('profesores', payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.load(this.page);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'No se pudo guardar el profesor.';
      },
    });
  }

  remove(profesor: Profesor): void {
    if (!confirm(`Eliminar ${profesor.user?.name ?? 'profesor'}?`)) {
      return;
    }

    this.api.delete('profesores', profesor.id).subscribe({
      next: () => this.load(this.page),
      error: () => (this.errorMessage = 'No se pudo eliminar el profesor.'),
    });
  }
}
