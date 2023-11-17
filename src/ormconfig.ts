/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// const password = Buffer.from(process.env.POSTGRES_PASSWORD, 'base64').toString('ascii');
// const password = Buffer.from(process.env.DB_PASSWORD_BASE64, 'base64').toString('ascii');
// const password = process.env.POSTGRES_PASSWORD.toString();
// const postgresPassword = process.env.DB_PASSWORD;
// const host = String(process.env.POSTGRES_HOST)

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `34.172.9.214`,
  port: +5432,
  username: `dumspiro`,
  password: `polliieteqwerty`,  
  database: `postgres`,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],  // Assuming your entities will be in .ts or .js files
  synchronize: true, // This will auto create the database tables on every application launch; not recommended for prod
};

export default config;
