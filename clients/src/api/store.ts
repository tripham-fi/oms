import { createContext, useContext } from "react";
export const store = {};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
