import { IsNotEmpty, IsString , IsOptional, IsEmail } from 'class-validator';
import { TokenDTO } from '../../lib/common.dto';


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