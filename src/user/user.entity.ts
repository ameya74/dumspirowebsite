/* eslint-disable prettier/prettier */
import { Entity, OneToMany, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from './userRoleEnum';
import { IsEmail, Length, IsEnum } from 'class-validator';
import { Order } from 'src/orders/entities/order.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    Username: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    @Length(8, 100)
    password: string; // This will be hashed

    @Column({ type: 'enum', enum: UserRole, default: UserRole.Customer })
    @IsEnum(UserRole)
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    userId: any;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];


  // Additional fields for customer address, preferences, etc.
}
