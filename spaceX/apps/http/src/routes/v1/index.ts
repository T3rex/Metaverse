import { Router } from "express";
import { userRouter } from "./users";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import client from "@repo/db/client";
import { SigninSchema, SignupSchema } from "../../types";
import { compare, hash } from "../../scrypt";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

export const router = Router();

router.post("/signup", async (req, res) => {
  const parseData = SignupSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  const hashedPassword = await hash(parseData?.data?.password || "");
  try {
    const user = await client.user.create({
      data: {
        username: parseData?.data?.username || "",
        password: hashedPassword,
        role: parseData?.data?.role === "Admin" ? "Admin" : "User",
      },
    });
    res.status(200).json({
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({
      message: "User already exists",
    });
  }
});

router.post("/signin", async (req, res) => {
  const parseData = SigninSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
  }
  try {
    const user = await client.user.findUnique({
      where: {
        username: parseData?.data?.username,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }
    const isValid = await compare(
      parseData?.data?.password || "",
      user.password
    );
    if (!isValid) {
      res.status(400).json({
        message: "Invalid password",
      });
      return;
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_PASSWORD);
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/elements", (req, res) => {
  res.json({ message: "Hello from spaceX" });
});

router.get("/avatars", (req, res) => {});

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/user", spaceRouter);
