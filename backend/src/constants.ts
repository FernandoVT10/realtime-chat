import { config } from "dotenv";
config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export const UPLOADS_DIRECTORY = "/uploads/";

export const MONGO_URI = process.env.MONGO_URI as string;
