import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getMyOrders() {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.baseUrl}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getAllOrders() {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.baseUrl}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getOrderDetails(orderId: number) {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.baseUrl}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  checkout(items: any[]) {
    const token = localStorage.getItem('auth_token');
    return this.http.post(
      `${this.baseUrl}/checkout`,
      { items },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  updateOrderStatus(orderId: number, status: string) {
    const token = localStorage.getItem('auth_token');
    return this.http.put(
      `${this.baseUrl}/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}