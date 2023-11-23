/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsUrl()
  @IsOptional()
  imageURL?: string;
}
