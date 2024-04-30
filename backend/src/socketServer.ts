import { Server, Socket } from "socket.io";
import { RequestError } from "./errors";

import getUserIdFromAuthToken from "./utils/getUserIdFromAuthToken";
import MessageRepository from "./repositories/MessageRepository";
import FriendsRepository from "./repositories/FriendsRepository";
import UserRepository from "./repositories/UserRepository";

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

// eslint-disable-next-line
const handleError = (error: unknown, cb: Function): void => {
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
};

const onSendMessage = (socket: Socket) => async (message: string, friendId: string, cb: unknown) => {
  const { userId } = socket.data;

  if(typeof cb !== "function") return;

  try {
    const createdMessage = await MessageRepository.createMessage(userId, friendId, message);

    try {
      // only one user should be in the "friendId" room
      const responses = await socket
        .to(friendId)
        .timeout(100)
        .emitWithAck("new-message", createdMessage);

      if(responses.length > 0 && responses[0].read) {
        await MessageRepository.markMessageAsRead(createdMessage._id);
      } 
      // eslint-disable-next-line
    } catch {}

    cb({ status: 200, createdMessage });
  } catch (error) {
    handleError(error, cb);
  }
};

const onDisconnect = (socket: Socket, friendsIds: string[]) => async () => {
  const { userId } = socket.data;

  if(friendsIds.length) {
    socket.to(friendsIds).emit("friend-disconnected", userId);
  }

  try {
    await UserRepository.updateUserStatus(userId, false);
  } catch (error) {
    console.error("Error: couldn't set isOnline to false", error);
  }
};

const onConnection = async (socket: Socket) => {
  const { userId } = socket.data;

  socket.join(userId);

  let friendsIds: string[] = [];

  try {
    friendsIds = await FriendsRepository.getFriendsIds(userId);
    socket.to(friendsIds).emit("friend-connected", userId);
  } catch (error) {
    console.error("Error: couldn't get the friendsIds", error);
  }

  try {
    await UserRepository.updateUserStatus(userId, true);
  } catch (error) {
    console.error("Error: couldn't set isOnline to true", error);
  }

  socket.on("send-message", onSendMessage(socket));

  socket.on("disconnect", onDisconnect(socket, friendsIds));
};

export const initSocketServer = (ioServer: Server) => {
  ioServer.use(authorizeMiddleware);

  ioServer.on("connection", onConnection);
};
