import { makeAutoObservable, runInAction } from "mobx";
import type { createUserPayload, createUserRequest } from "../constants/RequestType";
import consumer from "./consumer";
import type { ErrorResponse, UserListItem } from "../constants/ResponseType";

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
      const year = request.dob.getFullYear();
    const month = String(request.dob.getMonth() + 1).padStart(2, '0');
    const day = String(request.dob.getDate()).padStart(2, '0');
    const formattedDob = `${year}-${month}-${day}`;

      const payload: createUserPayload = {
        firstName: request.firstName.trim(),
        lastName: request.lastName.trim(),
        email: request.email.trim(),
        role: request.role,
        dob: formattedDob,
      };
      const response = await consumer.user.create(payload);

      if (response.result) {
        runInAction(() => {
          this.users.unshift(response.result);
        });
      }

      return response;
    } catch (err) {
      const errorResponse = err as ErrorResponse | undefined;
      const errorMessage = errorResponse?.message || "Failed to create user. Please try again.";
      runInAction(() => {
        this.error = errorMessage;
      });

      throw new Error(errorMessage);
    } finally {
      runInAction(() => {
        this.setLoadingInitial(false);
      });
    }
  };

  disableUser = async (id: number) => {
    try {
      await consumer.user.disable(id);
      runInAction(() => {
        this.users = this.users.filter((u) => u.id !== id);
      });
    } catch (err) {
      console.log(err);
    }
  };

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
}
