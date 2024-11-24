import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = `${environment.base_url}/carts`;

  constructor(private http: HttpClient) {}

  // Add product to cart
  addToCart(cartItem: { product_id: number; quantity: number }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.post(`${this.baseUrl}`, cartItem, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Get current user's cart
  getMyCart(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.baseUrl}/my-cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Update cart item
  updateCartItem(cartId: number, updatedItem: { quantity: number }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    
    return this.http.put(`${this.baseUrl}/${cartId}`, updatedItem, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Delete cart item
  deleteCartItem(cartId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.delete(`${this.baseUrl}/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Clear all cart items for the current user
  clearMyCart(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.delete(`${this.baseUrl}/my/clear`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  checkout(items: any[]) {
    const token = localStorage.getItem('auth_token');
    return this.http.post(
      `${environment.base_url}/orders/checkout`,
      { items },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}