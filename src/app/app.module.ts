import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LandingComponent } from './pages/landing/landing.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppComponent,
    HttpClientModule,
    FormsModule,

  ],
  providers: [LandingComponent],
  bootstrap: []
})
export class AppModule {
  constructor(private router: Router){}
}


