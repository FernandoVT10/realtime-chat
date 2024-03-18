import jwt from "jsonwebtoken";

import { RequestHandler, Request } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../constants";

type AuthorizeMiddleware = () => RequestHandler;

const verifyToken = (token: string): Promise<string | JwtPayload | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    });
  });
};

const getAuthTokenFromRequest = (req: Request): string | null => {
  const header = req.get("Authorization") || "";
  const [bearer, token] = header.split(" ");
  return bearer === "Bearer" && token ? token : null;
};

const authorize: AuthorizeMiddleware = () => async (req, res, next) => {
  const token = getAuthTokenFromRequest(req);

  if(!token) {
    return res.status(401).json({
      errors: [{
        message: "You need to be authenticated",
      }],
    });
  }

  try {
    const data = await verifyToken(token) as JwtPayload;

    if(!data.username) {
      return res.status(401).json({
        errors: [{
          message: "Invalid authentication token",
        }],
      });
    }

    req.user = { username: data.username };

    next();
  } catch (error) {
    if(error instanceof JsonWebTokenError) {
      return res.status(401).json({
        errors: [{
          message: "Invalid authentication token",
        }],
      });
    }

    next(error);
  }
};

export default authorize;
