/* eslint-disable prettier/prettier */

import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/user/userRoleEnum';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @IsOptional()
    @IsEnum(UserRole)
    readonly role?: UserRole;

    // Add other fields as needed, following the same pattern
    // Use IsOptional for fields that are not required in every update
}
