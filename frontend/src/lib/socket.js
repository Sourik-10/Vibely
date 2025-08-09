import { io as createSocketClient } from "socket.io-client";

let socketClient = null;

export function getSocketClient() {
  if (!socketClient) {
    socketClient = createSocketClient("http://localhost:5001", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socketClient;
}
