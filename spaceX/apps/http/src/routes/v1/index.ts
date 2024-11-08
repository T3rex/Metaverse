import { Router } from "express";
import { userRouter } from "./users";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";

export const router = Router();

router.post("/signup", (req, res) => {
  res.json({ message: "Signup" });
});

router.post("/signin", (req, res) => {
  res.json({ message: "Signin" });
});

router.get("/elements", (req, res) => {});

router.get("/avatars", (req, res) => {});

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/user", spaceRouter);
