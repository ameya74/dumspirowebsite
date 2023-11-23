// src/orders/orders.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
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
  async findAllByUser(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { userId: userId.toString() },
      relations: ['items'], // Include related entities as needed
    });

    if (!orders) {
      throw new NotFoundException(`No orders found for user with ID ${userId}`);
    }

    return orders;
  }

  async findAllwithFilter(filterDto: any): Promise<Order[]> {
    const { status, date, sort } = filterDto;
    let query = this.orderRepository.createQueryBuilder('order');

    if (status) {
      query = query.andWhere('order.status = :status', { status });
    }

    if (date) {
      query = query.andWhere('order.date = :date', { date });
    }

    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      query = query.orderBy(
        `order.${sortField}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    const orders = await query.getMany();
    return orders;
  }

  // Method to remove an order
  async remove(id: number, userId: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order || order.userId !== userId) {
      throw new NotFoundException(
        `Order with ID ${id} not found or unauthorized access`,
      );
    }
    await this.orderRepository.remove(order);
  }
}
