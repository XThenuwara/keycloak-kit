import axios from "axios";

//reject unauthorized certificates

const env = import.meta.env;
const SERVERURL = env?.VITE_SERVER_URL;

export const getAuth = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${SERVERURL}/auth-service/login`, { username, password });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const checkAuth = async (data: any) => {
  try {
    const res = await axios.post(`${SERVERURL}/auth-service/check-auth`, { ...data });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getRealmsForUser = async (data: any) => {
  try {
    const res = await axios.post(`${SERVERURL}/auth-service/whoami`, { ...data });
    return res.data;
  } catch (e) {
    throw e;
  }
};


export const createUsers = async (data: any) => {
    try {
        //remove status from data[]
        const newUsers = data.users.map((item: any) => {
            delete item.status;
            return item;
        });
        const newData = { ...data, users: newUsers };

        const res = await axios.post(`${SERVERURL}/user-service/create`, { ...newData });
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const activateUsers = async (data: any) => {
    try {
        //remove status from data[]
        const newUsers = data.users.map((item: any) => {
            delete item.status;
            return item;
        });
        const newData = { ...data, users: newUsers };

        const res = await axios.post(`${SERVERURL}/user-service/activate`, { ...newData });
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const deactivateUsers = async (data: any) => {
    try {
         //remove status from data[]
        const newUsers = data.users.map((item: any) => {
            delete item.status;
            return item;
        });
        const newData = { ...data, users: newUsers };

        const res = await axios.post(`${SERVERURL}/user-service/deactivate`, { ...newData });
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const deleteUsers = async (data: any) => {
    try {
        //remove status from data[]
        const newUsers = data.users.map((item: any) => {
            delete item.status;
            return item;
        });
        const newData = { ...data, users: newUsers };

        const res = await axios.post(`${SERVERURL}/user-service/delete`, { ...newData } );
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const getUsers = async (data: any) => {
    try {
        const res = await axios.post(`${SERVERURL}/user-service/search`, { ...data });
        return res.data;
    } catch (e) {
        throw e;
    }
}