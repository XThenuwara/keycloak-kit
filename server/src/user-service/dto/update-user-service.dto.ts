import { PartialType } from '@nestjs/mapped-types';
import { CreateUserServiceDto } from './create-user.request.dto';

export class UpdateUserServiceDto extends PartialType(CreateUserServiceDto) {}
