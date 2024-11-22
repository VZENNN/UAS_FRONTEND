import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail-admin',
  templateUrl: './product-detail-admin.component.html',
  styleUrls: ['./product-detail-admin.component.css']
})
export class ProductDetailAdminComponent implements OnInit {
  product: any;
  productId!: number;
  isLoggedIn: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.productId = id;

    if (id) {

      this.productService.getProductById(id).subscribe(
        (response: any) => {
          if (response.success) {
            this.product = response.data; // Set data produk
          }
        },
        (error) => {
          console.error('Error fetching product details:', error);
        }
      );

      this.authService.isLoggedIn.subscribe((status) => {
        this.isLoggedIn = status;
        this.cdr.detectChanges();
      });
    }
  }
}