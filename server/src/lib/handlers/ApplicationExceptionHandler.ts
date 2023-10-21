import { HttpException } from "@nestjs/common";
import { GlobalResponseObject, ErrorResponse } from "./GlobalResponse";

export const getErrorObject = (e: any) => {
    if (e.response && e.response.data && e.response.data.error && e.response.data.error_description) {
        return {
            error: e.response.data,
            message: e.response.data.error_description,
            status: e.response.status,
        };
    }
    
    if(e.response && e.response.data && e.response.data.error && typeof e.response.data.error == 'string') {
        return {
            error: e.response.data,
            message: e.response.data.error,
            status: e.response.status,
        };
    }
    
    if (e.response && e.response.data && e.response.data.errorMessage) {
        return {
        error: e.response,
        message: e.response.data.errorMessage,
        status: e.response.status,
      };
    }
  
    if (e.message && e.code) {
      return {
        error: e,
        message: e.message,
        status: e.code,
      };
    }
  
    if (e.message) {
      return {
        error: e,
        message: e.message,
        status: 500,
      };
    }

    if(e === null || e === undefined){
      return {
        error: {
          error: 'Something went wrong',
        },
        message: 'Something went wrong',
        status: 500,
      };
    }
  
    return {
      error: e,
      message: e.toString(),
      status: 500,
    };
  };

export class ApplicationExceptionHandler {
    constructor() {
        // do nothing
    }
    returnException<T extends GlobalResponseObject>(errorObj: any): T {      
        const error = getErrorObject(errorObj);
        let responseObj= {} as T;
        responseObj.status = error.status;
        responseObj.error = error.error;
        responseObj.message = error.message;
        responseObj.data = null;
       throw new HttpException(responseObj, error.status);
    }
}