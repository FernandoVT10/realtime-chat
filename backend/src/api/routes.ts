import { Router } from "express";

import userRoute from "./routes/user";
import usersRoute from "./routes/users";

const router = Router();

router.use("/user/", userRoute);
router.use("/users/", usersRoute);

export default router;
