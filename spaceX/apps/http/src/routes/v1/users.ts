import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import { adminMiddleware } from "../../middleware/admin";

export const userRouter = Router();

userRouter.post(
  "/metadata",
  userMiddleware,
  adminMiddleware,
  async (req, res) => {
    const parseData = UpdateMetadataSchema.safeParse(req.body);
    if (!parseData.success) {
      res.status(400).json({
        message: "Invalid data",
      });
      return;
    }
    try {
      await client.user.update({
        where: {
          id: req.userId,
        },
        data: {
          avatarId: parseData?.data?.avatarId,
        },
      });
      res.status(200).json({
        message: "Metadata updated",
      });
    } catch (error) {
      res.status(400).json({
        message: "something went wrong",
      });
    }
  }
);
userRouter.get("/metadata/bulk", async (req, res) => {
  const userIdsString = (req?.query?.ids ?? "[]") as string;
  const userIdsArray: string[] = userIdsString
    ?.slice(1, userIdsString?.length - 1)
    .split(",");
  try {
    const metadata = await client.user.findMany({
      where: {
        id: {
          in: userIdsArray,
        },
      },
      select: {
        avatar: true,
        id: true,
      },
    });
    console.log(metadata);
    res.status(200).json({
      avatars: metadata,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});
