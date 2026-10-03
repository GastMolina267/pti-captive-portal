export interface User {
  id: string;
  email: string;
  token: string | null;
  createdAt: Date;
  isActive: boolean;
}
