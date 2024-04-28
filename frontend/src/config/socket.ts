import { io } from "socket.io-client";
import getAuthToken from "../utils/getAuthToken";


const SOCKET_SERVER_URL = "http://localhost:3001";

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
  auth: {
    token: getAuthToken(),
  },
});

export type { Socket } from "socket.io-client";
export default socket;
