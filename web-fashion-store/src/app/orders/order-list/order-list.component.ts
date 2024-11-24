import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  orderCompleted: { [key: string]: boolean } = {};

  constructor(private orderService: OrderService,
    private router: Router) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data;
      },
      error: (error) => {
        console.error('Error fetching orders', error);
      }
    })
  }

  updateStatusOrder(orderId: number): void {
    this.orderService.updateOrderStatus(orderId, 'Completed').subscribe({
      next: () => {
        alert('Status pesanan berhasil diselesaikan');
        this.orderCompleted[orderId] = true;
        this.router.navigate(['/admin/orders']);
      },
      error: (error) => {
        console.error('Error updating orders:', error);
      },
    });
  }
}
