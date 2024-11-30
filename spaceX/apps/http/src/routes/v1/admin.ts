import { Router } from "express";
import {
  CreateElementSchema,
  UpdateElementSchema,
  CreateAvatarSchema,
  CreateMapSchema,
} from "../../types";
import client from "@repo/db/client";
import { adminMiddleware } from "../../middleware/admin";

export const adminRouter = Router();

adminRouter.post("/element/:spaceId", adminMiddleware, async (req, res) => {
  const parseData = CreateElementSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  const element = await client.element.create({
    data: {
      width: parseData.data.width,
      height: parseData.data.height,
      imageUrl: parseData.data.imageUrl,
      static: parseData.data.static,
    },
  });
  res.status(200).json({
    elementId: element.id,
  });
});
adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
  const parseData = UpdateElementSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  await client.element.update({
    where: {
      id: req.userId,
    },
    data: {
      imageUrl: parseData?.data?.imageUrl,
    },
  });
});
adminRouter.post("/avatar", adminMiddleware, async (req, res) => {
  const parseData = CreateAvatarSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  const avatar = await client.avatar.create({
    data: {
      imageUrl: parseData.data.imageUrl,
      name: parseData.data.name,
    },
  });
  res.json({
    avatarId: avatar.id,
  });
});
adminRouter.get("/map", adminMiddleware, async (req, res) => {
  const parseData = CreateMapSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  const map = await client.map.create({
    data: {
      width: parseInt(parseData.data.dimension.split("x")[0]),
      height: parseInt(parseData.data.dimension.split("x")[1]),
      name: parseData.data.name,
      thumbnail: parseData.data.thumbnail,
      mapElements: {
        create: parseData.data.defaultElements.map((element) => {
          return {
            elementId: element.elementId,
            x: element.x,
            y: element.y,
          };
        }),
      },
    },
  });
  res.json({
    mapId: map.id,
  });
});
