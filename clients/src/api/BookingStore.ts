import { makeAutoObservable, runInAction } from "mobx";
import type { Booking, ErrorResponse } from "../constants/ResponseType";
import consumer from "./consumer";

export class BookingStore {
  myBookings: Booking[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  createBooking = async (data: {
    roomId: number;
    title: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
  }) => {
    this.loading = true;

    try {
      const response = await consumer.booking.createBooking(data);
      if (response.status === "success") {
        const newBooking: Booking = response.result;
        runInAction(() => {
          this.myBookings.unshift(newBooking);
        });
        return { isSuccess: true, value: newBooking, error: null };
      } else {
        return {
          isSuccess: false,
          value: null,
          error: response.errors?.[0] || "Failed to create booking",
        };
      }
    } catch (error) {
      const errorResponse = error as ErrorResponse | undefined;
      const errorMessage = errorResponse?.message || "Failed to create booking. Please try again.";
      return {
        isSuccess: false,
        value: null,
        error: errorMessage,
      };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadMyBookings = async () => {
    this.loading = true;

    try {
      const response = await consumer.booking.getMyBookings();

      if (response.status === "success") {
        runInAction(() => {
          this.myBookings = response.result || [];
        });
      }
    } catch (error) {
      console.error("Error loading my bookings:", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
