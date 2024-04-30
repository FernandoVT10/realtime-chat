import { Router } from "express";
import { getUserIdFromRequest } from "../utils";

import asyncHandler from "express-async-handler";
import authorize from "../middlewares/authorize";
import UsersRepository from "../../repositories/UsersRepository";
import UsersValidator from "../validators/UsersValidator";

const router = Router();

router.get("/", authorize(), ...UsersValidator.users, asyncHandler(async (req, res) => {
  // sanitizing the search string, since it's going to be used to create a regex
  const search = (req.query.search as string).replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");

  const userId = getUserIdFromRequest(req);

  const users = await UsersRepository.searchUsers(search as string, userId);

  res.json({
    data: { users },
  });
}));

export default router;
