import { createServer } from "http";
import { Server } from "socket.io";
import { initSocketServer } from "./socketServer";

import mongoose from "mongoose";
import app from "./api/app";

const MONGOOSE_URI = "mongodb://127.0.0.1:27017/realtime-chat";

const httpServer = createServer(app);

const ioServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

async function main() {
  console.log("Connecting to mongodb...");
  await mongoose.connect(MONGOOSE_URI);
  console.log("Connected to MongoDB successfully");

  initSocketServer(ioServer);

  httpServer.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
  });
}

main();
