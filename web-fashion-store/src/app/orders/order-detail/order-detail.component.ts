import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderId!: number;
  order: any;
  orderItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Ambil order ID dari parameter route
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    // Panggil API untuk mendapatkan detail order
    this.orderService.getOrderDetails(this.orderId).subscribe(
      (response: any) => {
        if (response.success) {
          this.order = response.data;
          this.orderItems = response.data.items; // Set data order items
        }
      },
      (error) => {
        console.error('Error fetching order details:', error);
      }
    );
  }
}