/* eslint-disable prettier/prettier */
// src/users/dto/create-user.dto.ts
import { IsEmail, Length, IsEnum } from 'class-validator';
import { UserRole } from 'src/user/userRoleEnum';

export class CreateUserDto {
    @Length(4, 20)
    username: string;

    @IsEmail()
    email: string;

    @Length(8, 100)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
