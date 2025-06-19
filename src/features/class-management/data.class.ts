export interface ClassData {
  _id: string;
  name: string;
  members?: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    isActive: boolean;
    class?: {
      class_id: number;
      name: string;
    };
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    role: 'Student' | 'TedTeam' | 'Coach' | 'Admin';
  }[];
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}