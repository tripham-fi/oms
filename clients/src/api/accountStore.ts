import { makeAutoObservable, reaction, runInAction } from "mobx";
import type { CurrentAccountResult } from "../constants/ResponseType";
import consumer from "./consumer";
import type { loginRequest } from "../constants/RequestType";
import { store } from "./store";

export default class AccountStore {
  //   bookingRegistry = new Map<number, unknown>();
  account: CurrentAccountResult | null = null;
  loadingInitial: boolean = false;
  appLoaded: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.account,
      (account) => {
        if (account && !account.enabled) {
          this.logout();
        }
      },
    );
  }

  get isLoggedIn() {
    return !!this.account;
  }

  get isFirstLogin() {
    return this.account?.defaultPassword ?? false;
  }

  //   get bookingList() {
  //     return Array.from(this.bookingRegistry.values());
  //   }

  //   getBooking = (id: number) => {
  //     return this.bookingRegistry.get(id);
  //   };

  //   setBooking = (booking: unknown) => {
  //     booking.bookedDate = this.formatDate(new Date(assign.assignedDate));
  //     this.assignRegistry.set(assign.assignmentId, assign);
  //   };

  setAccount = async () => {
    this.setLoadingInitial(true);
    this.error = null;
    try {
      const acc = await consumer.account.current();
      runInAction(() => (this.account = acc.result));
    } catch (err) {
      runInAction(() => {
        localStorage.removeItem("jwtToken")
        this.error =
          err instanceof Error ? err.message : "Failed to load account or Session expired";
      });
      console.error("Failed to load current account:", err);
    } finally {
      runInAction(() => {
        this.setLoadingInitial(false);
        this.setAppLoaded();
      });
    }
  };

  

  login = async (request: loginRequest) => {
    this.setLoadingInitial(true);
    this.error = null;

    try {
      const res = await consumer.account.login(request);
      const token = res.result?.token;

      if (!token) {
        throw new Error("No token received from server");
      }
      runInAction(() => localStorage.setItem("jwtToken", token));

      await this.setAccount();
    } catch (err: { message?: string; status?: number } | Error | unknown) {
      runInAction(() => {
        let msg = "Login failed";

        if (err && typeof err === "object" && "message" in err) {
          msg = (err as { message: string }).message;
        } else if (err instanceof Error) {
          msg = err.message;
        }

        this.error = msg;
      });
      throw err;
    } finally {
      runInAction(() => {
        this.setLoadingInitial(false);
      });
    }
  };

  logout = async () => {
    runInAction(() => {
      localStorage.removeItem("jwtToken");
      this.account = null;
      this.appLoaded = false;
      this.error = null;
    });
    window.location.href = "/login"
  };

  resetPassword = async (newpwd: string) => {
    this.setLoadingInitial(true)

    try {
      const res = await consumer.account.resetPassword(newpwd)
      runInAction(() => {
        this.account = res.result
        store.modalStore.modal.firstLogin = false;
        store.modalStore.closeModal();
      });
      return res;
    }catch (err) {
      runInAction(() => {
        this.error =
          err instanceof Error ? err.message : "Failed to reset password";
      });
      console.error("Reset password failed:", err);
      throw err;
    } finally {
      runInAction(() => {
        this.setLoadingInitial(false);
      });
    }
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };

  setError = (msg: string | null) => {
    this.error = msg;
  };

  formatDate(date: Date | string | number): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
