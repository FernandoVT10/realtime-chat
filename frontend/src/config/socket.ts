import { io } from "socket.io-client";
import getAuthToken from "../utils/getAuthToken";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
  auth: {
    token: getAuthToken(),
  },
});

export type { Socket } from "socket.io-client";
export default socket;
