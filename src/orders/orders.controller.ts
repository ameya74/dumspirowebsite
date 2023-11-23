import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.entity';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrdersService) {}

  // Create a new order
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    try {
      // Assuming the createOrder method in the service expects a user ID
      return await this.orderService.createOrder(
        createOrderDto,
        user.id.toString(),
      );
    } catch (error) {
      throw new BadRequestException('Failed to create order');
    }
  }

  //`GET /orders/user/{userId}`: Get all orders placed by a specific user.
  // Retrieve an order by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
  //`GET /orders/user/{userId}`: Get all orders placed by a specific user.
  // Retrieve all orders by a specific user
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findAllByUser(@Param('userId', ParseIntPipe) userId: number) {
    try {
      return await this.orderService.findAllByUser(userId);
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve orders for user with ID ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Retrieve all orders
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllwithFilter(@Query() filterDto: any) {
    return this.orderService.findAllwithFilter(filterDto);
  }

  // Delete an order
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user) {
    try {
      await this.orderService.remove(id, user.id);
      return { status: HttpStatus.OK, message: 'Order successfully deleted' };
    } catch (error) {
      throw new HttpException(
        `Failed to delete order with ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
