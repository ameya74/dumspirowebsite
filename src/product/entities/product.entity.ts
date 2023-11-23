/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  category: string;

  @IsUrl()
  @IsOptional()
  @Column({ nullable: true })
  imageURL: string;

  @Column({ default: true })
  isActive: boolean;
}
