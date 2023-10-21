import { IsNotEmpty, IsString , IsOptional, IsEmail } from 'class-validator';
import { TokenDTO } from '../../lib/common.dto';

class User {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    roles: string;

    @IsOptional()
    groups: string;
}

export class CreateUserServiceDto {
    users: User[];
    realm: string;
    auth: TokenDTO;
}
