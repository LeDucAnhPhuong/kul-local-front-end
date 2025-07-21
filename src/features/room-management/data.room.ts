export interface RoomData {
  _id: string;
  name: string;
  description?: string;
  capacity?: number;
  location?: string;
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}
