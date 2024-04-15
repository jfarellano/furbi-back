import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ClientFormsModule } from './client-forms/client-forms.module';
import { GeneratorsModule } from './generators/generators.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    UsersModule,
    ClientsModule,
    AuthModule,
    ClientFormsModule,
    GeneratorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
