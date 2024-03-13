import { createServer } from "http";
import { Server } from "socket.io";

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import apiRoutes from "./api/routes";
import errorHandler from "./api/middlewares/errorHandler";

const MONGOOSE_URI = "mongodb://127.0.0.1:27017/realtime-chat";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

  app.use("/api", apiRoutes);
  app.use(errorHandler);

  ioServer.on("connection", (_socket) => {
    console.log("Socket.io connection");
  });

  httpServer.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
  });
}

main();
