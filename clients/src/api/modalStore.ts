import { makeAutoObservable } from "mobx";
import type { ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "";
type ModalState = {
  open: boolean;
  body: ReactNode | null;
  data: unknown | null;
  size: ModalSize;
  firstLogin: boolean;
};

export default class ModalStore {
  modal: ModalState = {
    open: false,
    body: null,
    data: null,
    size: "",
    firstLogin: false,
  };
  constructor() {
    makeAutoObservable(this);
  }

  openModal = (
    body: ReactNode,
    size: ModalSize = "",
    firstLogin: boolean = false,
  ) => {
    this.modal = {
      open: true,
      body,
      data: null,
      size,
      firstLogin,
    };
  };

  openDetailModal = (
    body: ReactNode,
    data: unknown = null,
    size: ModalSize = "",
  ) => {
    this.modal = {
      open: true,
      body,
      data,
      size,
      firstLogin: false,
    };
  };

  closeModal = () => {
    if (!this.modal.firstLogin) {
      this.modal = {
        open: false,
        body: null,
        data: null,
        size: "",
        firstLogin: false,
      };
    }
  };
  closeDetailModal = () => {
    this.modal = {
      open: false,
      body: null,
      data: null,
      size: "",
      firstLogin: false,
    };
  };
}
