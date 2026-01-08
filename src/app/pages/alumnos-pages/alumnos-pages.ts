import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlumnoService } from '../../services/alumno-service';

@Component({
  selector: 'app-alumnos-pages',
  standalone: true,  
  imports: [RouterModule], 
  templateUrl: './alumnos-pages.html',
  styleUrl: './alumnos-pages.css',
})
export class AlumnosPages implements OnInit {
  
  alumnos: any = null;

  constructor (private service: AlumnoService) {}

  ngOnInit(): void {
    this.service.getAlumnos().subscribe(r => {
      this.alumnos = r
    })
  }
}
