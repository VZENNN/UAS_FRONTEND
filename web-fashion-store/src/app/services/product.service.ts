import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.base_url;
  private token = localStorage.getItem('auth_token');

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }

  getProductById(productId: number) {
    return this.http.get(`${this.baseUrl}/products/${productId}`);
  }

  filterProducts(filters: any): Observable<any> {
    const params: any = {};

    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.name) params.name = filters.name;

    return this.http.get(
      `${this.baseUrl}/products/filter`, { params }
    );
  }

  create(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, product, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  update(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, product, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
}