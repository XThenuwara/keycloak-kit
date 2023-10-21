import React, { useState, useCallback, useEffect } from "react";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  identify: () => void;
}

export const SocketContext = React.createContext<ISocketContext>({
  socket: null,
  identify: () => {},
});

export const SocketContextProvider = (props: any) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketUrl, setSocketUrl] = useState("ws://localhost:3000");

  useEffect(() => {
    identify();
  }, [socketUrl]);

  const identify = () => {
    const socket = io(socketUrl);
    setSocket(socket);

    const auth = sessionStorage.getItem("token");
    const authObj = JSON.parse(auth || "{}");
    socket.emit("identify", { userId: authObj.userId, displayName: authObj.displayName });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        identify,
      }}>
      {props.children}
    </SocketContext.Provider>
  );
};
