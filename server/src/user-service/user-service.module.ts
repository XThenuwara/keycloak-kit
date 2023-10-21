import { Module } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { UserServiceController } from './user-service.controller';
import { ApplicationExceptionHandler } from '../lib/handlers/ApplicationExceptionHandler';
import { ConfigModule } from '@nestjs/config';
import { AuthServiceModule } from '../auth-service/auth-service.module';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [ConfigModule, EventsModule],
  controllers: [UserServiceController],
  providers: [AuthServiceService,UserServiceService,ApplicationExceptionHandler ]
})
export class UserServiceModule {}
