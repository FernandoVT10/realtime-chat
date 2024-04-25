import { RequestHandler, Request } from "express";
import { RequestError } from "../../errors";

import getUserIdFromAuthToken from "../../utils/getUserIdFromAuthToken";

type AuthorizeMiddleware = () => RequestHandler;

const getAuthTokenFromRequest = (req: Request): string | null => {
  const header = req.get("Authorization") || "";
  const [bearer, token] = header.split(" ");
  return bearer === "Bearer" && token ? token : null;
};

const authorize: AuthorizeMiddleware = () => async (req, res, next) => {
  const token = getAuthTokenFromRequest(req);

  try {
    req.userId = await getUserIdFromAuthToken(token);
    next();
  } catch (error) {
    if(error instanceof RequestError) {
      res.status(error.statusCode).json({
        errors: [{
          message: error.message,
        }],
      });
    } else {
      next(error);
    }
  }
};

export default authorize;
