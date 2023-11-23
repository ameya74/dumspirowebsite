import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  //`GET /products`: List all products.
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // `POST /products`: Add a new product.
  @Post()
  @UseGuards(JwtAuthGuard) // Assuming only authenticated users can add products
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  //`GET /products/{productId}`: Get details of a specific product.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  //`PUT /products/{productId}`: Update a specific product.
  @Put(':id')
  @UseGuards(JwtAuthGuard) // Assuming only authenticated users can update products
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      return await this.productsService.update(id, updateProductDto);
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  //`DELETE /products/{productId}`: Remove a specific product.
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Assuming only authenticated users can delete products
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.productsService.remove(id);
      return { status: HttpStatus.OK, message: 'Product successfully deleted' };
    } catch (error) {
      throw new HttpException(
        `Failed to delete product with ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
