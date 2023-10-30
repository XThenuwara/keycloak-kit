import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthServiceModule } from './auth-service/auth-service.module';
import { ConfigModule } from '@nestjs/config';
import { UserServiceModule } from './user-service/user-service.module';
import configuration from './lib/configuration';
import { EventsModule } from './events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client/dist'),
      serveRoot: '/client',
    }),
    EventsModule,
    AuthServiceModule,
    UserServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
