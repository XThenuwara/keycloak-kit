import React, { createContext, useEffect, useState } from "react";


interface IUser {
  userId: string;
  displayName: string;
  realm: string;
  realm_access: {
    [key: string]: string[];
  };
  create_relam: boolean
}

interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: (user: any) => {},
});

const UserContextProvider = (props: any) => {
  const { children } = props;

  const setUserInfo = (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    const userItem = localStorage.getItem("user");
    const user = userItem ? JSON.parse(userItem) : null;
    if (user) {
      setUser(user);
    }
  }, []);

  const contextValue = {
    user,
    setUser: setUserInfo,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
