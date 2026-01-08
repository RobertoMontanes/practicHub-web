import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  constructor(private http:HttpClient) {}

  getAlumnos() {
    return this.http.get("http://localhost:8000/api/profesores")
  }

}
