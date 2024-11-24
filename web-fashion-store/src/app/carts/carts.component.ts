import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  checkoutError: string = '';
  checkoutSuccess: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getMyCart().subscribe({
      next: (response) => {
        this.cartItems = response.data;
        this.calculateTotalPrice();
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  updateQuantity(cartId: number, newQuantity: string): void {
    const quantity = parseInt(newQuantity, 10); // Konversi dari string ke number
    if (isNaN(quantity) || quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }
  
    this.cartService.updateCartItem(cartId, { quantity }).subscribe({
      next: () => {
        this.loadCart();
        // alert('Quantity updated successfully');
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  deleteItem(cartId: number): void {
    this.cartService.deleteCartItem(cartId).subscribe({
      next: () => {
        this.loadCart();
        // alert('Item removed from cart');
      },
      error: (error) => {
        console.error('Error deleting item:', error);
      }
    });
  }

  clearCart(): void {
    this.cartService.clearMyCart().subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
        alert('Cart cleared successfully');
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      }
    });
  }

  checkout(): void {
    // Mengambil data items dari keranjang dan memanggil checkout service
    const items = this.cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }));

    // Panggil checkout API
    this.cartService.checkout(items).subscribe({
      next: (response) => {
        this.checkoutSuccess = true;
        this.checkoutError = '';
        // Navigasi ke halaman konfirmasi order jika checkout berhasil
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.checkoutError = err.error.message || 'Checkout failed';
        this.checkoutSuccess = false;
      }
    });
  }
}