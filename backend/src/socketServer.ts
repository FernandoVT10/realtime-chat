import { Server, Socket } from "socket.io";
import { RequestError } from "./errors";

import getUserIdFromAuthToken from "./utils/getUserIdFromAuthToken";
import MessageRepository from "./repositories/MessageRepository";

type SocketNextFn = (err?: Error) => void;

const authorizeMiddleware = async (socket: Socket, next: SocketNextFn) => {
  const { token } = socket.handshake.auth;

  try {
    socket.data.userId = await getUserIdFromAuthToken(String(token));
    next();
  } catch (error) {
    if(error instanceof RequestError) {
      return next(new Error(error.message));
    }

    next(new Error("Internal server error"));
  }
};

export const initSocketServer = (ioServer: Server) => {
  ioServer.use(authorizeMiddleware);

  ioServer.on("connection", (socket) => {
    const { userId } = socket.data;

    socket.join(userId);
    console.log("User connected with ID:", socket.data.userId);

    socket.on("send-message", async (message, friendId, cb) => {
      try {
        const createdMessage = await MessageRepository.createMessage(userId, friendId, message);

        socket.to(friendId).emit("new-message", createdMessage);

        cb({ status: 200 });
      } catch (error) {
        if(error instanceof RequestError) {
          cb({
            status: error.statusCode,
            error: error.message,
          });
        } else {
          cb({
            status: 500,
            error: "Internal Server Error",
          });

          // TODO: implement a better logger
          console.error("There was an error trying to create a message:", error);
        }
      }
    });
  });
};
