export interface RoomData {
  name: string;
  capacity: number;
  location: string;
  description: string;
  _id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  isActive: boolean;
}
