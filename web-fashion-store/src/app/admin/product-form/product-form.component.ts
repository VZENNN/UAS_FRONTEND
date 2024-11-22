import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: any = { name: '', category_id: '', description: '', image_url: null, price: null, stock: null };
  categories: any[] = [];
  isEdit: boolean = false;
  productId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEdit = true;
      this.productService.getAllProducts().subscribe({
        next: (response) => {
          const found = response.data.find(
            (cat: any) => cat.id === +this.productId!
          );
          if (found) this.product = found;
        },
        error: (error) => {
          console.error('Error fetching category:', error);
        },
      });
    }
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

  saveProduct() {
    if (this.isEdit) {
      this.productService.update(this.product.id, this.product).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => console.error(err)
      });
    } else {
      this.productService.create(this.product).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => console.error(err)
      });
    }
  }
}