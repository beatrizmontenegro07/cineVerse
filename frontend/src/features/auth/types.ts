export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Registration extends Credentials {
  email: string;
  password_confirmation: string;
}
