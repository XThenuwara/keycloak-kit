import { IsNotEmpty, IsString , IsOptional, IsEmail } from 'class-validator';

export class TokenDTO {
    @IsNotEmpty()
    @IsString()
    access_token: string;

    @IsNotEmpty()
    @IsString()
    refresh_token: string;

    @IsNotEmpty()
    @IsString()
    token_type: string;

    @IsNotEmpty()
    @IsString()
    scope: string;

    @IsNotEmpty()
    @IsString()
    session_state: string;

    @IsNotEmpty()
    @IsString()
    expires_in: string;

    @IsNotEmpty()
    @IsString()
    refresh_expires_in: string;

    @IsNotEmpty()
    @IsString()
    'not-before-policy': string;

    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    displayName: string
}