export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterCreds {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface LoginCreds {
  email: string;
  password: string;
}
