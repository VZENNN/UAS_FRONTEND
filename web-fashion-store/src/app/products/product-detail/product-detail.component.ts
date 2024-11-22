import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product: any;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.productId = id;

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

  addToCart(product: any): void {
    const cartItem = {
      product_id: product.id,
      quantity: 1 // Default quantity is 1
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: (response) => {
        alert('Produk berhasil ditambahkan ke dalam keranjang!');
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart.');
      }
    });
  }
}