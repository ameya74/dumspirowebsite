/* eslint-disable prettier/prettier */
// src/auth/dto/refresh-token.dto.ts

import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  readonly refreshToken: string;
}
