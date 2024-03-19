import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarDashComponent } from '../../../navbar-dash/navbar-dash.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-add-envios',
  standalone: true,
  imports: [NavbarDashComponent, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-envios.component.html',
  styleUrl: './add-envios.component.css'
})
export class AddEnviosComponent {
  envioForm: FormGroup;
  mensaje: string | null = null;
  allUsers: any[] = [];
  allProducts: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.envioForm = this.formBuilder.group({
      state: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      city: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      user_id: ['', Validators.required],
      product_id: ['', Validators.required],
      postal_code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
  }

  ngOnInit(): void {
    this.http.get<any>('http://127.0.0.1:8000/api/users').subscribe(
      (data: any) => {
        this.allUsers = data;
      },
      error => {
        console.error('Error al obtener los usuarios:', error);
      }
    );

    this.http.get<any>('http://127.0.0.1:8000/api/products').subscribe(
      (data: any) => {
        this.allProducts = data;
      },
      error => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.envioForm.valid) {
      const endpoint = `http://127.0.0.1:8000/api/shipments/create`;
      const userData = {
        state: this.envioForm.value.state,
        city: this.envioForm.value.city,
        address: this.envioForm.value.address,
        user_id: this.envioForm.value.user_id,
        product_id: this.envioForm.value.product_id,
        postal_code: this.envioForm.value.postal_code
      };
      console.log(userData);
      this.http.post(endpoint, userData).subscribe(
        (response: any) => {
          console.log('Envio creado:', response);
          const categoryNames = this.allUsers.find(user => user.id === userData.user_id)?.name;
          const platformName = this.allProducts.find(product => product.id === userData.product_id)?.name;
          this.mensaje = `Envio creado correctamente.`;
          this.envioForm.reset();
        },
        error => {
          console.error('Error al crear el envio:', error);
          this.mensaje = 'Error al crear el envio. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }
}