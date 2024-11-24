import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  category: { name: string } = { name: '' };
  isEdit = false;
  categoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['id'];
    if (this.categoryId) {
      this.isEdit = true;
      this.categoryService.getCategories().subscribe({
        next: (response) => {
          const found = response.data.find(
            (cat: any) => cat.id === +this.categoryId!
          );
          if (found) this.category = found;
        },
        error: (error) => {
          console.error('Error fetching category:', error);
        },
      });
    }
  }

  saveCategory(): void {
    if (this.isEdit) {
      this.categoryService.updateCategory(this.categoryId!, this.category).subscribe({
        next: () => {
          alert('Kategori berhasil diubah');
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
        },
      });
    } else {
      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          alert('Kategori berhasil disimpan');
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error creating category:', error);
        },
      });
    }
  }
}