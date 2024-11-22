import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  isAdmin: boolean = false; 
  categories: any[] = [];
  images: string[] = [];
  filters = {
    minPrice: '',
    maxPrice: '',
    categoryId: '',
    name: '',
  };

  constructor(
    private productService: ProductService, 
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.images = [
      'assets/sliders/1.jpg',
      'assets/sliders/2.jpg',
      'assets/sliders/3.webp',
      'assets/sliders/4.webp',
      'assets/sliders/5.webp',
    ];
    this.checkUserRole();
    this.loadCategories();
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.data;
      },
      error: (error) => {
        console.error('Error fetching products', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data; // Asumsikan API mengembalikan `data` berisi daftar kategori
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  applyFilter(): void {
    this.productService.filterProducts(this.filters).subscribe({
      next: (response: any) => {
        this.products = response.data;
      },
      error: (error) => {
        console.error('Error applying filters', error);
      },
    });
  }

  checkUserRole(): void {
    // Misalkan authService.getUserRole() mengembalikan role pengguna
    const userRole = this.authService.getRole(); // Pastikan ini sesuai dengan logika di aplikasi Anda
    this.isAdmin = userRole === 'admin';
  }
}