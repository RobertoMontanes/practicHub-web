import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminShell } from '../../shared/components/admin-shell/admin-shell';
import { ModalShared } from '../../shared/components/modal-shared/modal-shared';
import { ApiClient } from '../../services/api-client.service';
import {
  CursoAcademico,
  Empresa,
  PaginatedResponse,
  Profesor,
  SeguimientoPractica,
  User,
} from '../../services/api.types';

@Component({
  selector: 'app-practicas-pages',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, AdminShell, ModalShared], 
  templateUrl: './practicas-pages.html',
  styleUrl: './practicas-pages.css',
})
export class PracticasPages implements OnInit {
  private api = inject(ApiClient);

  seguimientos: SeguimientoPractica[] = [];
  empresas: Empresa[] = [];
  profesores: Profesor[] = [];
  cursos: CursoAcademico[] = [];
  usuarios: User[] = [];

  loading = false;
  saving = false;
  modalOpen = false;
  errorMessage = '';

  page = 1;
  perPage = 10;
  lastPage = 1;
  total = 0;

  form = new FormGroup({
    empresa_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    profesor_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    curso_academico_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    user_id: new FormControl<number | null>(null, { validators: [Validators.required] }),
    titulo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl<string>(''),
    fecha_inicio: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    fecha_fin: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    horas_totales: new FormControl<number | null>(null, { validators: [Validators.required] }),
    estado: new FormControl<string>(''),
    objetivos: new FormControl<string>(''),
    actividades: new FormControl<string>(''),
  });

  editingId: number | null = null;

  ngOnInit(): void {
    this.loadOptions();
    this.load();
  }

  load(page = 1): void {
    this.loading = true;
    this.page = page;
    this.api.list<SeguimientoPractica>('seguimientos', { page: this.page, per_page: this.perPage }).subscribe({
      next: (res: PaginatedResponse<SeguimientoPractica>) => {
        this.seguimientos = res.data;
        this.lastPage = res.last_page;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los seguimientos.';
        this.loading = false;
      },
    });
  }

  loadOptions(): void {
    forkJoin({
      empresas: this.api.list<Empresa>('empresas', { per_page: 100 }),
      profesores: this.api.list<Profesor>('profesores', { per_page: 100 }),
      cursos: this.api.list<CursoAcademico>('cursos-academicos', { per_page: 100 }),
      usuarios: this.api.list<User>('users', { per_page: 100 }),
    }).subscribe({
      next: (res) => {
        this.empresas = res.empresas.data;
        this.profesores = res.profesores.data;
        this.cursos = res.cursos.data;
        this.usuarios = res.usuarios.data;
      },
      error: () => {
        this.empresas = [];
        this.profesores = [];
        this.cursos = [];
        this.usuarios = [];
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.form.reset({
      empresa_id: null,
      profesor_id: null,
      curso_academico_id: null,
      user_id: null,
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      horas_totales: null,
      estado: '',
      objetivos: '',
      actividades: '',
    });
    this.modalOpen = true;
  }

  openEdit(seguimiento: SeguimientoPractica): void {
    this.editingId = seguimiento.id;
    this.errorMessage = '';
    this.form.patchValue({
      empresa_id: seguimiento.empresa_id,
      profesor_id: seguimiento.profesor_id,
      curso_academico_id: seguimiento.curso_academico_id,
      user_id: seguimiento.user_id,
      titulo: seguimiento.titulo,
      descripcion: seguimiento.descripcion ?? '',
      fecha_inicio: seguimiento.fecha_inicio,
      fecha_fin: seguimiento.fecha_fin,
      horas_totales: seguimiento.horas_totales,
      estado: seguimiento.estado ?? '',
      objetivos: seguimiento.objetivos ?? '',
      actividades: seguimiento.actividades ?? '',
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
      ? this.api.update<SeguimientoPractica>('seguimientos', this.editingId, payload)
      : this.api.create<SeguimientoPractica>('seguimientos', payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.load(this.page);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'No se pudo guardar el seguimiento.';
      },
    });
  }

  remove(seguimiento: SeguimientoPractica): void {
    if (!confirm(`Eliminar seguimiento "${seguimiento.titulo}"?`)) {
      return;
    }

    this.api.delete('seguimientos', seguimiento.id).subscribe({
      next: () => this.load(this.page),
      error: () => (this.errorMessage = 'No se pudo eliminar el seguimiento.'),
    });
  }
}
