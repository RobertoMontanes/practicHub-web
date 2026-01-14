import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminShell } from '../../shared/components/admin-shell/admin-shell';
import { ModalShared } from '../../shared/components/modal-shared/modal-shared';
import { EmpresasService } from '../../services/empresas.service';
import { Empresa, EmpresaPayload, PaginatedResponse } from '../../services/api.types';

@Component({
  selector: 'app-empresas-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminShell, ModalShared],
  templateUrl: './empresas-pages.html',
  styleUrl: './empresas-pages.css',
})
export class EmpresasPages implements OnInit, OnDestroy {
  private empresasService = inject(EmpresasService);

  empresas: Empresa[] = [];
  loading = false;
  saving = false;
  modalOpen = false;
  errorMessage = '';
  successMessage = '';

  page = 1;
  perPage = 10;
  lastPage = 1;
  total = 0;
  private successTimeout: ReturnType<typeof setTimeout> | null = null;

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

  ngOnDestroy(): void {
    this.clearSuccessMessage();
  }

  load(page = 1): void {
    this.loading = true;
    this.page = page;
    this.empresasService.list(this.page, this.perPage).subscribe({
      next: (res: PaginatedResponse<Empresa>) => {
        this.empresas = res.data;
        this.page = res.current_page;
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
    if (this.saving) {
      return;
    }
    this.editingId = null;
    this.errorMessage = '';
    this.clearSuccessMessage();
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
    if (this.saving) {
      return;
    }
    this.editingId = empresa.id;
    this.errorMessage = '';
    this.clearSuccessMessage();
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
    if (this.saving) {
      return; // Prevent double submit while a request is in flight
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.clearSuccessMessage();

    const payload = this.form.getRawValue() as EmpresaPayload;
    const isEditing = !!this.editingId;
    const request = isEditing
      ? this.empresasService.update(this.editingId!, payload)
      : this.empresasService.create(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.successMessage = isEditing
          ? 'La empresa se actualizo correctamente.'
          : 'La empresa se creo correctamente.';
        this.startSuccessTimeout();
        const nextPage = isEditing ? this.page : 1;
        this.editingId = null;
        this.load(nextPage);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'No se pudo guardar la empresa.';
      },
    });
  }

  remove(empresa: Empresa): void {
    if (this.saving) {
      return;
    }
    if (!confirm(`Eliminar ${empresa.nombre}?`)) {
      return;
    }

    this.empresasService.delete(empresa.id).subscribe({
      next: () => this.load(this.page),
      error: () => (this.errorMessage = 'No se pudo eliminar la empresa.'),
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
