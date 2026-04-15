import { createContext, useContext } from "react";
import AccountStore from "./accountStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";
import { RoomStore } from "./roomStore";
import { BookingStore } from "./BookingStore";

export type RootStore = {
  accountStore: AccountStore;
  userStore: UserStore;
  modalStore: ModalStore;
  roomStore: RoomStore;
  bookingStore: BookingStore;
}

export const store: RootStore = {
  accountStore: new AccountStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore(),
  roomStore: new RoomStore(),
  bookingStore: new BookingStore(),
};

export const StoreContext = createContext<RootStore | undefined>(undefined);

export function useStore(): RootStore {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
