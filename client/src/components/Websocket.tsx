import React, { useState, useCallback, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export const WebSocketDemo = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketUrl, setSocketUrl] = useState("ws://localhost:3000");

  useEffect(() => {
    //init socket
    const socket = io(socketUrl);
    console.log(socket);
    setSocket(socket);

    socket.emit("events", { data: "I'm connected!" });
  }, [socketUrl]);

  return <></>;
};
