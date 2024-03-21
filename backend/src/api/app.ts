import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

import { UPLOADS_DIRECTORY } from "../constants";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use("/uploads", express.static(UPLOADS_DIRECTORY));

app.use("/api", routes);
app.use(errorHandler);

export default app;
