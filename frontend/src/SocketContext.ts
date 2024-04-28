import { createContext } from "react";
import socket, { Socket } from "./config/socket";

const SocketContext = createContext<Socket>(socket);

export default SocketContext;
