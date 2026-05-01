export interface User {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  link_drive: string;
  file_type: string;
  thumbnail_url: string;
}

export interface AuthState {
  user: { username: string; userId: number } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
