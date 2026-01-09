import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminShell } from '../../shared/components/admin-shell/admin-shell';
import { ModalShared } from '../../shared/components/modal-shared/modal-shared';
import { ApiClient } from '../../services/api-client.service';
import { Empresa, PaginatedResponse } from '../../services/api.types';

@Component({
  selector: 'app-empresas-pages',
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, AdminShell, ModalShared],
  templateUrl: './empresas-pages.html',
  styleUrl: './empresas-pages.css',
})
export class EmpresasPages implements OnInit {
  private api = inject(ApiClient);

  empresas: Empresa[] = [];
  loading = false;
  saving = false;
  modalOpen = false;
  errorMessage = '';

  page = 1;
  perPage = 10;
  lastPage = 1;
  total = 0;

  form = new FormGroup({
    nombre: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    cif: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    direccion: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    telefono: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    sector: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    tutor_empresa: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email_tutor: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    activo: new FormControl<boolean>(true, { nonNullable: true }),
  });

  editingId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(page = 1): void {
    this.loading = true;
    this.page = page;
    this.api
      .list<Empresa>('empresas', { page: this.page, per_page: this.perPage })
      .subscribe({
        next: (res: PaginatedResponse<Empresa>) => {
          this.empresas = res.data;
          this.lastPage = res.last_page;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'No se pudieron cargar las empresas.';
          this.loading = false;
        },
      });
  }

  openCreate(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.form.reset({
      nombre: '',
      cif: '',
      direccion: '',
      telefono: '',
      email: '',
      sector: '',
      tutor_empresa: '',
      email_tutor: '',
      activo: true,
    });
    this.modalOpen = true;
  }

  openEdit(empresa: Empresa): void {
    this.editingId = empresa.id;
    this.errorMessage = '';
    this.form.patchValue({
      nombre: empresa.nombre,
      cif: empresa.cif,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
      sector: empresa.sector,
      tutor_empresa: empresa.tutor_empresa,
      email_tutor: empresa.email_tutor,
      activo: empresa.activo ?? true,
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
    this.errorMessage = '';
    const payload = this.form.getRawValue();

    const request = this.editingId
      ? this.api.update<Empresa>('empresas', this.editingId, payload)
      : this.api.create<Empresa>('empresas', payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.load(this.page);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'No se pudo guardar la empresa.';
      },
    });
  }

  remove(empresa: Empresa): void {
    if (!confirm(`Eliminar ${empresa.nombre}?`)) {
      return;
    }

    this.api.delete('empresas', empresa.id).subscribe({
      next: () => this.load(this.page),
      error: () => (this.errorMessage = 'No se pudo eliminar la empresa.'),
    });
  }

}
