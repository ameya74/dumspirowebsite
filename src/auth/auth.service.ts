/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }
    
    //Function to validate user
    async validateUser(Username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsername(Username);
        if (user && bcrypt.compareSync(pass, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    //Function to login
    async login(authCredentialsDto: AuthCredentialsDto) {
        const user = await this.validateUser(authCredentialsDto.username, authCredentialsDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid login credentials');
        }
        const payload = { username: user.username, sub: user.userId };
        return {
        access_token: this.jwtService.sign(payload),
        };
    } 

    //Function to register
    async register(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return newUser;
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    
    let userData;
    try {
      userData = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findOne(userData.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { username: user.Username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m', // access token expiry time
      }),
      refresh_token: refreshToken, // optionally issue a new refresh token
    };
  }
}
