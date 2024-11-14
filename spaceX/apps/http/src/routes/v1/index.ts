import { Router } from "express";
import { userRouter } from "./users";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import client from "@repo/db/client";

export const router = Router();

router.get("/signup", (req, res) => {
  res.json({ message: "Signup" });
});

router.get("/signin", (req, res) => {
  res.json({ message: "Signin" });
});

router.get("/elements", (req, res) => {});

router.get("/avatars", (req, res) => {});

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/user", spaceRouter);
