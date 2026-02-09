export interface SignInData {
  login: string;
  password: string;
}

export interface UserResponse {
  id: number;
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
}
