export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  reportCount?: number;
}

export interface AuthSession {
  user: UserProfile;
  token?: string; // Optional if session cookie used
}
