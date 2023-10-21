import { IsNotEmpty, IsString , IsOptional, IsEmail } from 'class-validator';
import { TokenDTO } from '../../lib/common.dto';

export class GetUserByUsernameDTO {
    authObj: TokenDTO;
    username: string;
    realm: string;
}