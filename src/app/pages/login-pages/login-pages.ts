import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-pages',
  standalone: true,  
  imports: [RouterModule, ReactiveFormsModule],  
  templateUrl: './login-pages.html',
  styleUrls: ['./login-pages.css']
})
export class LoginPages {
  loginForm = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)])
  })
}