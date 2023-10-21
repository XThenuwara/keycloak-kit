import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { CreateUserServiceDto } from './dto/create-user.request.dto';
import { UpdateUserServiceDto } from './dto/update-user-service.dto';
import { SearchUserRequestDTO } from './dto/search.request.dto';
import { ApplicationExceptionHandler } from '../lib/handlers/ApplicationExceptionHandler';
import { GlobalResponseObject } from '../lib/handlers/GlobalResponse';
import { Request } from 'express';

@Controller('user-service')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService,   private readonly applicationExceptionHandler: ApplicationExceptionHandler) {}

  @Post('create')
  async create(@Body() createUserServiceDto: CreateUserServiceDto) {
    try{
      const res = await this.userServiceService.create(createUserServiceDto);
      return new GlobalResponseObject(200,null,'Request successfull',res);
    }catch(e){
      return this.applicationExceptionHandler.returnException(e);
    }
  }

  @Post('activate')
  async activate(@Body() createUserServiceDto: CreateUserServiceDto) {
    try{
      const res = await this.userServiceService.updateState(createUserServiceDto, true);
      return new GlobalResponseObject(200,null,'Request successfull',res);
    }catch(e){
      return this.applicationExceptionHandler.returnException(e);
    }
  }

  @Post('deactivate')
  async deactivate(@Body() createUserServiceDto: CreateUserServiceDto) {
    try{
      const res = await this.userServiceService.updateState(createUserServiceDto, false);
      return new GlobalResponseObject(200,null,'Request successfull',res);
    }catch(e){
      return this.applicationExceptionHandler.returnException(e);
    }
  }

  @Post('delete')
  async delete(@Body() createUserServiceDto: CreateUserServiceDto) {
    try{
      const res = await this.userServiceService.delete(createUserServiceDto);
      return new GlobalResponseObject(200,null,'Request successfull',res);
    }catch(e){
      return this.applicationExceptionHandler.returnException(e);
    }
  }

  @Post('search')
  async search(@Body() searchUserRequestDto: SearchUserRequestDTO) {
    try{
      const res = await this.userServiceService.search(searchUserRequestDto);
      return new GlobalResponseObject(200,null,'Request successfull',res);
    }catch(e){
      return this.applicationExceptionHandler.returnException(e);
    }
  }
}
