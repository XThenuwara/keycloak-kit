import { Injectable } from '@nestjs/common';
import { LoginRequestDTO } from './dto/Login.request.dto';
import axios from 'axios';
import { CheckAuthRequestDTO } from './dto/CheckAuth.request.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthServiceService {

    constructor(private configService: ConfigService) {}


    async login(request: LoginRequestDTO) {
        try{
            const KC_HOST = this.configService.get<string>('KC_HOST');
            const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    
            const res = await axios.post(`${KC_HOST}/auth/realms/master/protocol/openid-connect/token`, {
                grant_type: 'password',
                client_id: KC_CLIENT,
                username: request.username,
                password: request.password
            });
            return res.data;
        }catch(e){
            throw e
        }
    }
    
    async checkAuth(request: CheckAuthRequestDTO) {
        try{
            const KC_HOST = this.configService.get<string>('KC_HOST');
            const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            const res = await axios.post(`${KC_HOST}/auth/realms/master/protocol/openid-connect/token`, {
                grant_type: 'refresh_token',
                client_id: KC_CLIENT,
                refresh_token: request.refresh_token
            });
            return res.data;
        }catch(e){
            throw e
        }
    }


    async whoami(request: CheckAuthRequestDTO) {
        try{
            const KC_HOST = this.configService.get<string>('KC_HOST');
            const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            const auth = await this.checkAuth(request);

            const res = await axios.get(`${KC_HOST}/auth/admin/master/console/whoami`, {
                headers: {
                  Authorization: `Bearer ${auth.access_token}`,
                },
              });
            return res.data;
        }catch(e){
            throw e
        }
    }
}
