import { Body, Controller, Post } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { ApplicationExceptionHandler } from '../lib/handlers/ApplicationExceptionHandler';
import { GlobalResponseObject } from '../lib/handlers/GlobalResponse';
import { LoginRequestDTO } from './dto/Login.request.dto';
import { CheckAuthRequestDTO } from './dto/CheckAuth.request.dto';

@Controller('auth-service')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}


  @Post('login')
  async login(@Body() body: LoginRequestDTO) {
    try {
      const res = await this.authServiceService.login(body);
      return new GlobalResponseObject(200,null,'Authorization successfull',res);
    } catch (e) {
      return this.applicationExceptionHandler.returnException(e);
    }
  }

  @Post('check-auth')
  async checkAuth(@Body() body: CheckAuthRequestDTO) {
    try {
      const res = await this.authServiceService.checkAuth(body);
      return new GlobalResponseObject(200,null,'Authorization successfull',res);
    } catch (e) {
      return this.applicationExceptionHandler.returnException(e);
    }
  }

  @Post('whoami')
  async whoami(@Body() body: CheckAuthRequestDTO) {
    try {
      const res = await this.authServiceService.whoami(body);
      return new GlobalResponseObject(200,null,'Authorization successfull',res);
    } catch (e) {
      return this.applicationExceptionHandler.returnException(e);
    }
  }
}
