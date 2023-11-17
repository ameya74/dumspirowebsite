/* eslint-disable prettier/prettier */
// src/orders/orders.service.ts

import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<Order> {
    // Create a new order instance
    const order = this.orderRepository.create({
      userId,
      deliveryAddress: createOrderDto.deliveryAddress,
      paymentMethod: createOrderDto.paymentMethod,
    });

    // Save the order to the database
    await this.orderRepository.save(order);

    // Process order items
    const orderItems = createOrderDto.items.map((item) => {
      const orderItem = this.orderItemRepository.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      });
      return orderItem;
    });

    // Save order items to the database
    await this.orderItemRepository.save(orderItems);

    // Return the complete order with items
    return { ...order, items: orderItems };
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items'] });
  }
  findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
}
