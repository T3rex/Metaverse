import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";

function generateId(len: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export class User {
  userId: string = "";
  constructor(private ws: WebSocket) {
    this.userId = generateId(10);
  }

  initHandlers() {
    this.ws.on("message", (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join": {
          const spaceId = parsedData.payload.spaceId;
          RoomManager.getInstance().addUser(spaceId, this);
          this.send({
            type: "space-joined",
            payload: { userId: this.userId, spaceId: spaceId },
          });
        }
      }
    });
  }

  send(message: OutgoingMessage) {
    this.ws.send(JSON.stringify(message));
  }
}
