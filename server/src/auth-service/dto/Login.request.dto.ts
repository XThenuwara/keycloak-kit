import { IsNotEmpty, IsString , IsOptional, IsEmail } from 'class-validator';

// RT - refresh token
export class LoginRequestDTO {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}