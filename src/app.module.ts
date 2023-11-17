/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
//test

@Module({
  imports: [
      UsersModule,
      ConfigModule.forRoot({
        isGlobal: true, // This makes the config globally available
        }),
      TypeOrmModule.forRoot(config),
      MongooseModule.forRoot(process.env.MONGODB_URI),
      AuthModule,
      OrdersModule,
     ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
