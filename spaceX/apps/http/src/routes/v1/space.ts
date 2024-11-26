import { json, Router } from "express";
import {
  AddElementSchema,
  CreateElementSchema,
  CreateMapSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parseData = CreateSpaceSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  try {
    if (parseData.data.mapId) {
      await client.space.create({
        data: {
          name: parseData.data.name,
          width: parseInt(parseData.data.dimension.split("x")[0]),
          height: parseInt(parseData.data.dimension.split("x")[1]),
          creatorId: req.userId as string,
        },
      });
    } else {
      const map = await client.map.findUnique({
        where: {
          id: parseData.data.mapId,
        },
        select: {
          mapElements: true,
          width: true,
          height: true,
        },
      });
      if (!map) {
        res.status(400).json({
          message: "Invalid mapId",
        });
      }
      await client.$transaction(async () => {
        if (map) {
          const space = await client.space.create({
            data: {
              name: parseData.data.name,
              width: map.width,
              height: map.height,
              creatorId: req.userId as string,
            },
          });
          await client.spaceElements.createMany({
            data: map?.mapElements.map((element) => ({
              spaceId: space.id,
              elementId: element.elementId,
              x: element.x ?? 0,
              y: element.y ?? 0,
            })),
          });
        }
      });
    }
  } catch (error) {}
});

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
  try {
    const space = await client.space.findUnique({
      where: {
        id: req.params.spaceId,
      },
      select: {
        creatorId: true,
      },
    });
    if (!space) {
      res.status(400).json({
        message: "Invalid spaceId",
      });
    }
    if (space?.creatorId != req.userId) {
      res.status(403).json({
        message: "You are not authorized to delete this space",
      });
    }
    await client.spaceElements.deleteMany({
      where: {
        spaceId: req.params.spaceId,
      },
    });
    res.json(200).json({
      message: "Space deleted successfully",
    });
  } catch (error) {}
});
spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId,
    },
  });
  res.json(200).json({
    spaces: spaces.map((space) => ({
      id: space.id,
      thumbnail: space.thumbnail,
      name: space.name,
      dimension: `${space.width}x${space.height}`,
    })),
  });
});
spaceRouter.post("/element", userMiddleware, async (req, res) => {
  const parseData = AddElementSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  const space = await client.space.findUnique({
    where: {
      id: req.body.spaceId,
      creatorId: req.userId,
    },
    select: {
      height: true,
      width: true,
    },
  });
  if (!space) {
    res.json(400).json({
      message: "Invalid spaceId",
    });
  }

  await client.spaceElements.create({
    data: {
      spaceId: req.body.spaceId,
      elementId: req.body.elementId,
      x: parseData.data.x,
      y: parseData.data.y,
    },
  });

  res.json(200).json({
    message: "Element added successfully",
  });
});
spaceRouter.delete("/element", userMiddleware, async (req, res) => {
  const parseData = DeleteElementSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  const spaceElement = await client.spaceElements.findFirst({
    where: {
      id: req.body.id,
    },
    include: {
      space: true,
    },
  });
  if (spaceElement?.space.creatorId != req.userId) {
    res.status(403).json({
      message: "You are not authorized to delete this element",
    });
  }

  await client.spaceElements.delete({
    where: {
      id: req.body.id,
    },
  });
});

spaceRouter.get("/:spaceId");
