import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { UserFormComponent } from '../../forms/user-form/user-form.component';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NavbarComponent, UserFormComponent, RouterLink, RouterLinkActive],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
  export class SignupComponent implements OnInit {
    buttonText: string = 'Registrarse';
    endpoint: string = 'https://6f6f-2806-101e-d-a299-c169-f1b5-8ce1-acf5.ngrok-free.app/api/register'; // Endpoint de registro

    constructor(private loginService: LoginService) {}

    ngOnInit(): void {
      // Puedes activar el formulario de registro al iniciar el componente si lo deseas
      this.loginService.setIsRegistering(true);
    }

    switchToLogin(): void {
      this.loginService.setIsRegistering(true);
    }
}


