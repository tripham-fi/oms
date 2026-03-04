import { createContext, useContext } from "react";
import AccountStore from "./accountStore";
import ModalStore from "./modalStore";

export type RootStore = {
  accountStore: AccountStore;
  modalStore: ModalStore
}

export const store: RootStore = {
  accountStore: new AccountStore(),
  modalStore: new ModalStore(),
};

export const StoreContext = createContext<RootStore | undefined>(undefined);

export function useStore(): RootStore {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
