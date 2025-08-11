import { io as createSocketClient } from "socket.io-client";

let socketClient = null;

export function getSocketClient() {
  if (!socketClient) {
    socketClient = createSocketClient("https://vibely-2.onrender.com", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socketClient;
}
