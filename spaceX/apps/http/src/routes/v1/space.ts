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
import { idText } from "typescript";
import { adminMiddleware } from "../../middleware/admin";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parseData = CreateSpaceSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({
      message: "Invalid dataferfwrf",
    });
    return;
  }
  try {
    if (!parseData.data.mapId) {
      const space = await client.space.create({
        data: {
          name: parseData.data.name,
          width: parseInt(parseData.data.dimensions.split("x")[0]),
          height: parseInt(parseData.data.dimensions.split("x")[1]),
          creatorId: req.userId as string,
        },
      });
      res.status(200).json({
        spaceId: space.id,
      });
    } else {
      const map = await client.map.findFirst({
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
          message: "Invalid mapId1231",
        });
      }
      let space = await client.$transaction(async () => {
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
          return space;
        }
      });
      res.status(200).json({
        spaceId: space?.id,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
});

//delete request not sending headers
spaceRouter.post("/:spaceId", userMiddleware, async (req, res) => {
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
      return;
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
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
});
spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId,
    },
  });
  if (!spaces) {
    res.json(400).json({
      spaces: [],
    });
  }
  res.status(200).json({
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

spaceRouter.get("/:spaceId", async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    include: {
      elements: {
        include: {
          element: true,
        },
      },
    },
  });
  if (!space) {
    res.status(400).json({
      message: "Invalid spaceId",
    });
  }
  res.json({
    dimensions: `${space?.width}x${space?.height}`,
    elements: space?.elements.map((elements) => {
      return {
        id: elements.id,
        x: elements.x,
        y: elements.y,
        elementId: elements.elementId,
        element: {
          id: elements.element.id,
          imageUrl: elements.element.imageUrl,
          width: elements.element.width,
          height: elements.element.height,
          static: elements.element.static,
        },
      };
    }),
  });
});
