import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPages } from "./pages/login-pages/login-pages";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginPages],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('practicHub-web');
}
