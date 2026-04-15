export type LoginResult = {
  tokenType: 'Bearer';
  expiresIn: number;
  token: string;
  username: string;
}

export type CurrentAccountResult = {
  username: string;
  fullName: string;
  role: string;
  enabled: boolean;
  defaultPassword: boolean;
}

export type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  available: boolean;
}

export type UserListItem = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  enabled: boolean;
}

export type Booking = {
  id: number;
  roomId: number;
  roomName: string;
  title: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
}

export type ErrorResponse = {
  message: string;
  status: number
}