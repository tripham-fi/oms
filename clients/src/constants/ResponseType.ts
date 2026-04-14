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

export type UserListItem = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  enabled: boolean;
}
