import { Component } from '@angular/core';
import { DynamicTableComponent } from '../../../dynamic-table/dynamic-table.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarDashComponent } from '../../../navbar-dash/navbar-dash.component';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-envios',
  standalone: true,
  imports: [DynamicTableComponent, CommonModule, ReactiveFormsModule, NavbarDashComponent, RouterModule],
  templateUrl: './edit-envios.component.html',
  styleUrl: './edit-envios.component.css'
})
export class EditEnviosComponent {
  envioForm: FormGroup;
  envio: any;
  mensaje: string | null = null;
  allUsers: any[] = [];
  allProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
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
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.obtenerEnvio(productId);
    });

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
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  obtenerEnvio(shipmentId: number): void {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const endpoint = `https://6f6f-2806-101e-d-a299-c169-f1b5-8ce1-acf5.ngrok-free.app/api/shipments/${shipmentId}`;
    this.http.get<any>(endpoint, {headers: headers}).subscribe(
      (data: any) => {
        this.envio = data;
        this.initializeForm();
      },
      error => {
        console.error('Error al obtener el envio:', error);
        this.router.navigate(['dashboard/envios/']);
      }
    );
  }

  initializeForm(): void {
    if (this.envio) {
      console.log('Producto:', this.envio);
      this.envioForm.patchValue({
        state: this.envio.state,
        city: this.envio.city,
        address: this.envio.address,
        user_id: this.envio.user_id,
        product_id: this.envio.product_id,
        postal_code: this.envio.postal_code
      });
    }
  }

  onSubmit(): void {
    if (this.envioForm.valid) {
      const shipmentId = this.envio.id;
      const endpoint = `https://6f6f-2806-101e-d-a299-c169-f1b5-8ce1-acf5.ngrok-free.app/api/shipments/${shipmentId}/update`;
      const userData = this.envioForm.value; // Usar los valores del formulario
      console.log(userData);
      const token = this.cookieService.get('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.put(endpoint, userData, {headers: headers}).subscribe(
        (response: any) => {
          console.log('Producto actualizado:', response);
          const userNames = this.allUsers.find(user => user.id === userData.user_id)?.name;
          const productName = this.allProducts.find(product => product.id === userData.product_id)?.name;
          this.mensaje = `Envio actualizado correctamente`;
        },
        error => {
          console.error('Error al actualizar el envio:', error);
          this.mensaje = 'Error al actualizar el envio. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }
}
