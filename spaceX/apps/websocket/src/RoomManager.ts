import { User } from "./User";
import { OutgoingMessage } from "./types";

export class RoomManager {
  room: Map<string, User[]> = new Map();
  static instance: RoomManager;

  private constructor() {
    this.room = new Map();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  public addUser(spaceId: string, user: User) {
    if (!this.room.has(spaceId)) {
      this.room.set(spaceId, [user]);
      return;
    }
    this.room.set(spaceId, [...(this.room.get(spaceId) ?? []), user]);
  }

  public broadcast(message: OutgoingMessage, user: User, roomId: string) {
    if (!this.room.has(roomId)) {
      return;
    }
    this.room.get(roomId)?.forEach((u) => {
      if (u.userId !== user.userId) {
        u.send(message);
      }
    });
  }
}
