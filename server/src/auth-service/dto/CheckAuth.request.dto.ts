import { IsNotEmpty, IsString , IsOptional, IsEmail } from 'class-validator';


export class CheckAuthRequestDTO {
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
}