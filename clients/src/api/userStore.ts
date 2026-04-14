import { makeAutoObservable, runInAction } from "mobx";
import type { UserListItem } from "../constants/ResponseType";
import type { createUserRequest } from "../constants/RequestType";
import consumer from "./consumer";

export default class UserStore {
  users: UserListItem[] = [];
  loadingInitial = false;
  searchQuery = "";
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  loadUsers = async () => {
    this.loadingInitial = true;
    try {
      const user = await consumer.user.list();
      runInAction(() => {
        if (user.result == null || user.result.length == 0) {
          this.users = [];
        } else {
          this.users = user.result;
        }
        this.loadingInitial = false;
      });
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };

  setSearchQuery = (query: string) => {
    this.searchQuery = query.trim();
  };

  get filteredUsers(): UserListItem[] {
    if (!this.searchQuery) return this.users;

    const q = this.searchQuery.toLowerCase();

    return this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(q) ||
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q),
    );
  }

  get userByNameSort(): UserListItem[] {
    return [...this.filteredUsers].sort((a, b) =>
      a.fullName.localeCompare(b.fullName),
    );
  }

  clearUsers = () => {
    this.users = [];
    this.searchQuery = "";
  };

  create = async (request: createUserRequest) => {
    this.setLoadingInitial(true);
    this.error = null;

    try {
      const formData = new FormData();
      formData.append("FirstName", request.firstName);
      formData.append("LastName", request.lastName);
      formData.append("Gender", request.email);
      formData.append("DoB", this.formatDate(request.dob));
      formData.append("Type", request.role);
      const newUser = await consumer.user.create(formData);
      if (newUser.result !== null) {
        this.users.unshift(newUser.result);
      }
    } catch (err: { message?: string; status?: number } | Error | unknown) {
      runInAction(() => {
        let msg = "Create new user failed";

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

  disableUser = async(id: number) => {
    try {
      await consumer.user.disable(id);
      runInAction(() => {
        this.users = this.users.filter(u => u.id !== id);
      })
    } catch (err) {
      console.log(err);
    }
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
}
