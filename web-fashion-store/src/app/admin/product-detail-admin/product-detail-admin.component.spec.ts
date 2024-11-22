import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailAdminComponent } from './product-detail-admin.component';

describe('ProductDetailAdminComponent', () => {
  let component: ProductDetailAdminComponent;
  let fixture: ComponentFixture<ProductDetailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
