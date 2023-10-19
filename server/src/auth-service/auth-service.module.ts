import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthServiceController } from './auth-service.controller';
import { ApplicationExceptionHandler } from '../lib/handlers/ApplicationExceptionHandler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, ApplicationExceptionHandler]
})
export class AuthServiceModule {}
