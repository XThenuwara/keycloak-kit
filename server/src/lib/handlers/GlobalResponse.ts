export class GlobalResponseObject {
    status: string | number | boolean;
    message: string;
    error: any;
    data?: any;
    /**
     *
     * @param status
     * @param error
     * @param message
     * @param data
     */
    constructor(status: string | number | boolean, error: any, message: string, data?: any) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.data = data;
    }
}

export class ErrorResponse extends Error {
    error: number;
    message: string;
    constructor(error: number, message: string) {
        super();
        this.error = error;
        this.message = message;
    }
}