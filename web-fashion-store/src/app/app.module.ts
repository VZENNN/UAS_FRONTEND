import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Navbar & Footer
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CookieService } from 'ngx-cookie-service';

// Modul Fitur
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

// Modul HTTP
import { HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { CartComponent } from './carts/carts.component';
import { CategoriesModule } from './categories/categories.module';
import { ProductListAdminComponent } from './admin/product-list-admin/product-list-admin.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { ProductDetailAdminComponent } from './admin/product-detail-admin/product-detail-admin.component';
import { RouterModule } from '@angular/router';

// Registrasi locale Indonesia
registerLocaleData(localeId, 'id-ID');

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CartComponent,
    ProductListAdminComponent,
    ProductFormComponent,
    ProductDetailAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    FormsModule,
    CategoriesModule,
    RouterModule
  ],
  providers: [
    CookieService,
    { provide: LOCALE_ID, useValue: 'id-ID' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }