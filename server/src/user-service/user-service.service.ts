import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserServiceDto } from './dto/create-user.request.dto';
import { UpdateUserServiceDto } from './dto/update-user-service.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { GetUserByUsernameDTO } from './dto/getUserByUsername.request.dto';
import { getErrorObject } from '../lib/handlers/ApplicationExceptionHandler';
import { handlePromise } from '../lib/utils';
import * as https from 'https';
import { SearchUserRequestDTO } from './dto/search.request.dto';

@Injectable()
export class UserServiceService {
  constructor(
    private configService: ConfigService,
    private authService: AuthServiceService,
  ) {}

  async getUserByUsername(request: GetUserByUsernameDTO) {
    try {
      const { username, realm, authObj } = request;
      const KC_HOST = this.configService.get<string>('KC_HOST');
      const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

      //get auth
      const token = await this.authService.checkAuth(authObj);

      //get
      const user = await axios.get(
        `${KC_HOST}/auth/admin/realms/${realm}/users?username=${username}`,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        },
      );

      //validation
      if (user.data.length === 0)
        throw new HttpException('User Not Found', 404);

      if (user.data[0].username.toLowerCase() !== username.toLowerCase())
        throw new HttpException('User Not Found', 404);

      return user.data[0];
    } catch (e) {
      throw e;
    }
  }

  async getRoles(relam, authObj) {
    try {
      const KC_HOST = this.configService.get<string>('KC_HOST');
      const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

      const headers = { Authorization: `Bearer ${authObj.access_token}` };
      const roles = await axios.get(
        `${KC_HOST}/auth/admin/realms/${relam}/roles`,
        { headers },
      );

      return roles.data;
    } catch (e) {
      throw e;
    }
  }

  async getGroups(relam, authObj) {
    try {
      const KC_HOST = this.configService.get<string>('KC_HOST');
      const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

      const headers = { Authorization: `Bearer ${authObj.access_token}` };
      const groups = await axios.get(
        `${KC_HOST}/auth/admin/realms/${relam}/groups`,
        { headers },
      );

      return groups.data;
    } catch (e) {
      throw e;
    }
  }

  async create(createUserServiceDto: CreateUserServiceDto) {
    try {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      axios.defaults.httpsAgent = httpsAgent;
      const { users, realm, auth } = createUserServiceDto;
      const response = [];

      const KC_HOST = this.configService.get<string>('KC_HOST');
      const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

      //auth
      let authObj = await this.authService.checkAuth(auth);
      //get roles
      const roles = await this.getRoles(realm, authObj);
      //get groups
      const groups = await this.getGroups(realm, authObj);

      // modify user object
      const usersModified = users.map((user) => {
        const newUser = {
          ...user,
          roles: user.roles?.split(',') || [],
          groups: user.groups?.split(',') || [],
        };
        return newUser;
      });


      for (const [index, user] of usersModified.entries()) {
        // initailize response object
        const userResponse = {
          username: user.username,
          status: null,
          message: null,
          roles: user.roles.map((role) => ({
            name: role,
            status: null,
            message: null,
          })),
          groups: user.groups.map((group) => ({
            name: group,
            status: null,
            message: null,
          })),
        };
        try {
          //create a deep copy of user
          let userCopy = JSON.parse(JSON.stringify(user));
          userCopy.enabled = true;
          delete userCopy.password;
          delete userCopy.roles;
          delete userCopy.groups;
          delete userCopy.status;

          authObj = await this.authService.checkAuth(auth);
          let headers = { Authorization: `Bearer ${authObj.access_token}` };

          //create user
          axios.defaults.headers.post['Content-Type'] = 'application/json';
          const [createUserError, createUser] = await handlePromise(
            axios.post(
              `${KC_HOST}/auth/admin/realms/${realm}/users`,
              userCopy,
              { headers },
            ),
          );


          // to check if user already exist, if then assign roles and groups
          if (createUserError) {
            const createUserErrorObj = getErrorObject(createUserError);
            userResponse.status = false;
            userResponse.message = createUserErrorObj.message;

            //if use exist and assignIfExists is true
            if (createUserErrorObj.status !== 409) {
              response.push(userResponse);
              continue;
            }
          }

          //get user
          const userDetails = await this.getUserByUsername({
            username: user.username,
            realm,
            authObj: auth,
          });

          //set password
          const passwordData = {
            type: 'password',
            value: user.password,
            temporary: true,
          };
          const setPassword = await axios.put(
            `${KC_HOST}/auth/admin/realms/${realm}/users/${userDetails.id}/reset-password`,
            passwordData,
            { headers },
          );

          //check roles
          const rolesToAssign = [];
          user.roles = [...new Set(user.roles)];
          for (const role of user.roles) {
            const roleFound = roles.find((r) => r.name === role);
            if (roleFound) rolesToAssign.push(roleFound);
            else {
              userResponse.roles.find((r) => r.name === role).status = false;
              userResponse.roles.find((r) => r.name === role).message =
                'role_not_found';
            }
          }

          //check groups
          const groupsToAssign = [];
          user.groups = [...new Set(user.groups)];
          for (const group of user.groups) {
            const groupFound = groups.find((g) => g.name === group);
            if (groupFound) groupsToAssign.push(groupFound);
            else {
              userResponse.groups.find((g) => g.name === group).status = false;
              userResponse.groups.find((g) => g.name === group).message =
                'group_not_found';
            }
          }

          //assign roles
          for (const role of rolesToAssign) {
            const [assignRoleError, assignRoleData] = await handlePromise(
              axios.post(
                `${KC_HOST}/auth/admin/realms/${realm}/users/${userDetails.id}/role-mappings/realm`,
                [role],
                { headers },
              ),
            );
            if (assignRoleError) {
              const assignRoleErrorObj = getErrorObject(assignRoleError);
              userResponse.roles.find((r) => r.name === role.name).status =
                false;
              userResponse.roles.find((r) => r.name === role.name).message =
                assignRoleErrorObj.message;
            } else
              userResponse.roles.find((r) => r.name === role.name).status =
                true;
          }

          //assign groups
          for (const group of groupsToAssign) {
            const [assignGroupError, assignGroupData] = await handlePromise(
              axios.put(
                `${KC_HOST}/auth/admin/realms/${realm}/users/${userDetails.id}/groups/${group.id}`,
                { group },
                { headers },
              ),
            );
            if (assignGroupError) {
              const assingGroupErrorObj = getErrorObject(assignGroupError);
              userResponse.groups.find((g) => g.name === group.name).status =
                false;
              userResponse.groups.find((g) => g.name === group.name).message =
                assingGroupErrorObj.message;
            } else
              userResponse.groups.find((g) => g.name === group.name).status =
                true;
          }

          userResponse.status = true;
          userResponse.message = 'User Created';
          //assign client roles

          response.push(userResponse);
        } catch (e) {
          const errorObj = getErrorObject(e);
          userResponse.status = false;
          userResponse.message = errorObj.message;
          response.push(userResponse);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return response as any;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateState(request: CreateUserServiceDto, activate: boolean) {
    try {
      let { users, auth, realm } = request;
      const KC_HOST = this.configService.get<string>('KC_HOST');
      const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

      const usersModified = users.map((user) => {
        const newUser = {
          ...user,
          roles: user.roles?.split(',') || [],
          groups: user.groups?.split(',') || [],
        };
        return newUser;
      });

      // auth
      let authObj = await this.authService.checkAuth(auth);
      const response = [];


      for (const user of usersModified) {
        authObj = await this.authService.checkAuth(auth);
        let headers = { Authorization: `Bearer ${authObj.access_token}` };

        const userResponse = {
          username: user.username,
          status: null,
          message: null,
        };

        //getUserId
        const [getUserError, userDetails] = await handlePromise(this.getUserByUsername({
          username: user.username,
          realm,
          authObj: auth,
        }));

        if (getUserError) {
          const getUserErrorObj = getErrorObject(getUserError);
          userResponse.status = false;
          userResponse.message = getUserErrorObj.message;
          response.push(userResponse);
          continue;
        }

        authObj = await this.authService.checkAuth(auth);
        //update user
        const [updateUserError, updateUser] = await handlePromise(
          axios.put(
            `${KC_HOST}/auth/admin/realms/${realm}/users/${userDetails.id}`,
            { ...userDetails, enabled: activate },
            { headers },
          ),
        );

        if (updateUserError) {
          const updateUserErrorObj = getErrorObject(updateUserError);
          userResponse.status = updateUserErrorObj.status;
          userResponse.message = updateUserErrorObj.message;
          continue;
        }

        userResponse.status = true;
        userResponse.message = `${activate ? 'Activate' : 'Deactivate'}d`;

        response.push(userResponse);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  async delete(request: CreateUserServiceDto) {
    try {
      let { users, auth, realm } = request;
      const KC_HOST = this.configService.get<string>('KC_HOST');
      const KC_CLIENT = this.configService.get<string>('KC_CLIENT');
      const response = [];


      const usersModified = users.map((user) => {
        const newUser = {
          ...user,
          roles: user.roles?.split(',') || [],
          groups: user.groups?.split(',') || [],
        };
        return newUser;
      });

      // auth
      let authObj = await this.authService.checkAuth(auth);

      for (const user of usersModified) {
        const userResponse = {
          username: user.username,
          status: null,
          message: null,
        };

        //getUserId
        const [userError, userData] = await handlePromise(this.getUserByUsername({
          username: user.username,
          realm,
          authObj: auth,
        }));


        if (userError) {
          const getUserErrorObj = getErrorObject(userError);
          userResponse.status = false;
          userResponse.message = getUserErrorObj.message;
          response.push(userResponse);
          continue;
        }

        authObj = await this.authService.checkAuth(auth);
        let headers = { Authorization: `Bearer ${authObj.access_token}` };

        //delete user
        const [deleteUserError, deleteUser] = await handlePromise(
          axios.delete(
            `${KC_HOST}/auth/admin/realms/${realm}/users/${userData.id}`,
            { headers },
          ),
        );

        if (deleteUserError) {
          const deleteUserErrorObj = getErrorObject(deleteUserError);
          userResponse.status = false;
          userResponse.message = deleteUserErrorObj.message;
          continue;
        }

        userResponse.status = true;
        userResponse.message = `Deleted`;

        response.push(userResponse);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return response;

    } catch (e) {
      throw e;
    }
  }

  async search(request: SearchUserRequestDTO) {
    try{
      const { auth , pagination  } = request
      const reponse = [];
      const KC_HOST = this.configService.get<string>('KC_HOST');
      const KC_CLIENT = this.configService.get<string>('KC_CLIENT');

      let authObj = await this.authService.checkAuth(auth);
      let headers = { Authorization: `Bearer ${authObj.access_token}` };

      const [userDetailsError, userDetails] = await handlePromise(axios.get(
        `${KC_HOST}/auth/admin/realms/master/users?briefRepresentation=true&first=${pagination.first}&max=${pagination.max}${pagination.search ? `&search=${pagination.search}` : '' }`,
        { headers },
      ));

      if(userDetailsError) throw userDetailsError;

      //get roles
      ///auth/admin/realms/sfcs/users/94f43cae-70f1-4783-89cf-3681f987eb74/role-mappings/realm

      for(const user of userDetails.data){
        const userResponse = {
          ...user,
          roles: null,
          groups: null,
          status: null,
          message: null,
        }

        authObj = await this.authService.checkAuth(auth);
        headers = { Authorization: `Bearer ${authObj.access_token}` };

        const [rolesError, roles] = await handlePromise(axios.get(
          `${KC_HOST}/auth/admin/realms/master/users/${user.id}/role-mappings/realm`,
          { headers },
        ));
        
        if(rolesError) {
          userResponse.status = false;
          userResponse.message = rolesError.message;
          reponse.push(userResponse);
          continue;
        }

        userResponse.roles = roles.data;

        const [groupsError, groups] = await handlePromise(axios.get(
          `${KC_HOST}/auth/admin/realms/master/users/${user.id}/groups`,
          { headers },
        ));

        if(groupsError) {
          userResponse.status = false;
          userResponse.message = groupsError.message;
          reponse.push(userResponse);
          continue;
        }
        userResponse.groups = groups.data;

        userResponse.status = true;
        userResponse.message = 'success';

        reponse.push(userResponse);
      }

      return reponse;
    }catch(e){
      throw e;
    }
  }
}
