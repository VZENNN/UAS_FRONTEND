import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  editCategory(id: number): void {
    window.location.href = `/categories/${id}/edit`;
  }

  deleteCategory(id: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          alert('Kategori berhasil dihapus');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        },
      });
    }
  }
}