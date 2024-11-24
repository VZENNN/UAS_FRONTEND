import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.baseUrl}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createCategory(category: { name: string }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.post(`${this.baseUrl}/categories`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateCategory(id: number, category: { name: string }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.put(`${this.baseUrl}/categories/${id}`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteCategory(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.delete(`${this.baseUrl}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}