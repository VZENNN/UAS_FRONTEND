import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrderListComponent } from './order-list/order-list.component';

@NgModule({
  declarations: [
    MyOrdersComponent,
    OrderDetailComponent,
    OrderListComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
  ]
})
export class OrdersModule { }