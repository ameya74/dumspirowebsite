/* eslint-disable prettier/prettier */
// src/orders/entities/order-item.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column()
  orderId: number;

  @Column()
  productId: string; // Assuming product is identified by a string ID

  @Column()
  quantity: number;
}
