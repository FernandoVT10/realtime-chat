import { createServer } from "http";
import { Server } from "socket.io";
import { initSocketServer } from "./socketServer";
import { MONGO_URI } from "./constants";

import mongoose from "mongoose";
import app from "./api/app";

const httpServer = createServer(app);

const ioServer = new Server(httpServer);

async function main() {
  console.log("Connecting to mongodb...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB successfully");

  initSocketServer(ioServer);

  httpServer.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
  });
}

main();
