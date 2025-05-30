export interface StudentData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  isActive: boolean;
  class?: {
    class_id: number;
    name: string;
  };
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  role: 'Student' | 'TedTeam' | 'Coach' | 'Admin';
}
