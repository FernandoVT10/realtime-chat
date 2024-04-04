import { Router } from "express";

import userRoute from "./routes/user";
import usersRoute from "./routes/users";
import friendsRoute from "./routes/friends";

const router = Router();

router.use("/user/", userRoute);
router.use("/users/", usersRoute);
router.use("/friends/", friendsRoute);

export default router;
