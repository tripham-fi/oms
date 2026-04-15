import { makeAutoObservable, runInAction } from "mobx";
import type { Room } from "../constants/ResponseType";
import consumer from "./consumer";

export class RoomStore {
  rooms: Room[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadRooms = async () => {
    this.loading = true;

    try {
      const response = await consumer.booking.getAvailableRooms();
      if (response.status === "success") {
        runInAction(() => {
          this.rooms = response.result || [];
        });
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
