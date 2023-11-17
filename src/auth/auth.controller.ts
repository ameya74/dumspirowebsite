/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts

import { Controller, Post, UseGuards, Body, HttpCode, HttpStatus, BadRequestException  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
            private readonly httpService: HttpService,
    private readonly configService: ConfigService,) {}

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('local'))
    @Post('login')
        async login(@Body() authCredentialsDto: AuthCredentialsDto) {
        return this.authService.login(authCredentialsDto);
    }

    @Post('register')
        async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }


    @Post('reset-password')
    async resetPassword(@Body('email') email: string) {
        const auth0Domain = this.configService.get('AUTH0_DOMAIN');
        const clientId = this.configService.get('AUTH0_CLIENT_ID');

        const url = `https://${auth0Domain}/dbconnections/change_password`;
        const body = {
            client_id: clientId,
            email,
            connection: 'Username-Password-Authentication', // This might vary based on your Auth0 setup
        };
        const headers = { 'content-type': 'application/json' };

    try {
        // Call the Auth0 API to initiate the password reset
        const response = await this.httpService
            .post(url, body, { headers })
            .toPromise();

        return response.data;
    }
    catch (error) {
        // Handle errors, such as network issues or invalid client IDs
        throw new BadRequestException(error);
        throw error.response.data;
    }
  }
}
