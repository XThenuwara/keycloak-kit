import { IsNotEmpty, IsString , IsOptional, IsEmail } from 'class-validator';

class TokenDTO {
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


// http://localhost:8080/auth/admin/realms/master/users?briefRepresentation=true&first=0&max=20&search=d

class Pagination {
    @IsNotEmpty()
    @IsString()
    first: string;

    @IsNotEmpty()
    @IsString()
    max: string;

    @IsNotEmpty()
    @IsString()
    search: string;
}

export class SearchUserRequestDTO {
    auth: TokenDTO;
    pagination: Pagination;
    realm: string;
}