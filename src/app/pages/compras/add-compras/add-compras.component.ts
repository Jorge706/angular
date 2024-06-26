import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarDashComponent } from '../../../navbar-dash/navbar-dash.component';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-add-compras',
  standalone: true,
  imports: [NavbarDashComponent, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-compras.component.html',
  styleUrl: './add-compras.component.css'
})
export class AddComprasComponent {
  compraForm: FormGroup;
  mensaje: string | null = null;
  allUsers: any[] = [];
  allProducts: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.compraForm = this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      date: ['', [Validators.required]],
      total: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      user_id: ['', Validators.required],
      product_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('https://6f6f-2806-101e-d-a299-c169-f1b5-8ce1-acf5.ngrok-free.app/api/users', {headers: headers}).subscribe(
      (data: any) => {
        this.allUsers = data;
      },
      error => {
        console.error('Error al obtener los usuarios:', error);
      }
    );

    this.http.get<any>('https://6f6f-2806-101e-d-a299-c169-f1b5-8ce1-acf5.ngrok-free.app/api/products', {headers: headers}).subscribe(
      (data: any) => {
        this.allProducts = data;
      },
      error => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.compraForm.valid) {
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const endpoint = `https://6f6f-2806-101e-d-a299-c169-f1b5-8ce1-acf5.ngrok-free.app/api/purchases/create`;
      const userData = {
        quantity: this.compraForm.value.quantity,
        date: this.compraForm.value.date,
        total: this.compraForm.value.total,
        user_id: this.compraForm.value.user_id,
        product_id: this.compraForm.value.product_id
      };
      console.log(userData);
      this.http.post(endpoint, userData, {headers: headers}).subscribe(
        (response: any) => {
          console.log('Envio creado:', response);
          const categoryNames = this.allUsers.find(user => user.id === userData.user_id)?.name;
          const platformName = this.allProducts.find(product => product.id === userData.product_id)?.name;
          this.mensaje = `Compra creada correctamente.`;
          this.compraForm.reset();
        },
        error => {
          console.error('Error al crear el envio:', error);
          this.mensaje = 'Error al crear la  compra. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }
}
