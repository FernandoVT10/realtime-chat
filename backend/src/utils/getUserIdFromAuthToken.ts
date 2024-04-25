import jwt, { JsonWebTokenError, TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants";
import { isValidObjectId } from "mongoose";
import { RequestError } from "../errors";

export const verifyAuthToken = (token: string): Promise<string | JwtPayload | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    });
  });
};

const getUserIdFromAuthToken = async (token: string | null): Promise<string> => {
  if(!token) throw new RequestError(401, "You must be authenticated");

  try {
    const data = await verifyAuthToken(token) as JwtPayload;

    if(!isValidObjectId(data.userId)) {
      throw new RequestError(400, "Invalid authentication token");
    }

    return data.userId;
  } catch (error) {
    if(error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
      throw new RequestError(400, "Invalid authentication token");
    }

    throw error;
  }
};

export default getUserIdFromAuthToken;
