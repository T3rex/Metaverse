import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async (req, res) => {
  const parseData = UpdateMetadataSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  await client.user.update({
    where: {
      id: req.userId,
    },
    data: {
      avatarId: parseData?.data?.avatarId,
    },
  });
});
userRouter.get("/metadata/bulk", async (req, res) => {
  const userIdsString = (req?.query?.ids ?? "[]") as string;
  const userIdsArray: string[] = userIdsString
    ?.slice(1, userIdsString?.length - 2)
    .split(",");

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

  res.status(200).json({
    avatars: metadata.map((m) => {
      return {
        userId: m?.id,
        avatar: m?.avatar?.imageUrl,
      };
    }),
  });
});
