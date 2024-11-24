import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import Komponen Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Import Komponen Products
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';

// Import Komponen Orders
import { MyOrdersComponent } from './orders/my-orders/my-orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { CartComponent } from './carts/carts.component';

// Import Komponen Category
import { CategoryFormComponent } from './categories/category-form/category-form.component';
import { CategoryListComponent } from './categories/category-list/category-list.component';

// Import AuthGuard
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

// Import Admin
import { ProductDetailAdminComponent } from './admin/product-detail-admin/product-detail-admin.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { ProductListAdminComponent } from './admin/product-list-admin/product-list-admin.component';

// Rute
const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' }, // Default: daftar produk
  { path: 'login', component: LoginComponent }, // Halaman Login
  { path: 'register', component: RegisterComponent }, // Halaman Register
  { path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard] }, // Daftar Kategori
  { path: 'categories/new', component: CategoryFormComponent, canActivate: [AuthGuard] }, // Tambah Kategori
  { path: 'categories/:id/edit', component: CategoryFormComponent, canActivate: [AuthGuard] }, // Ubah Kategori
  { path: 'products', component: ProductListComponent }, // Daftar Produk
  { path: 'products/:id', component: ProductDetailComponent }, // Detail Produk
  { path: 'my-carts', component: CartComponent, canActivate: [AuthGuard] }, // Daftar Order Saya
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] }, // Daftar Order Saya
  { path: 'my-orders/:id', component: OrderDetailComponent, canActivate: [AuthGuard] }, // Detail Order Saya
  // { path: '**', redirectTo: '/products' }, // Redirect jika rute tidak ditemukan
  { path: 'admin/orders', component: OrderListComponent, canActivate: [AdminGuard] },
  { path: 'admin/products', component: ProductListAdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/products/create', component: ProductFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/products/edit/:id', component: ProductFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/products/:id', component: ProductDetailAdminComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }