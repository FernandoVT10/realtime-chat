import path from "path";
import { config } from "dotenv";
config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export const UPLOADS_DIRECTORY = path.join(__dirname, "../uploads/");
