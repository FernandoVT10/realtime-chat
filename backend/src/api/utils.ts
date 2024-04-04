import { Request } from "express";

export const getUserIdFromRequest = (req: Request): string => {
  const userId = req.userId;

  if(!userId) {
    throw new Error(`
      The "req.userId" is null or undefined.
      Check if you have used the "authorize" middleware.
    `);
  }

  return userId;
};
