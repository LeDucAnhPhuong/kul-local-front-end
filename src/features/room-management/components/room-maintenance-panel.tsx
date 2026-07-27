'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useBulkUpdateRoomCapacityMutation,
  useDuplicateRoomMutation,
  useUpdateRoomMaintenanceStatusMutation,
} from '../api.room';
import type { RoomData } from '../data.room';

interface RoomMaintenancePanelProps {
  room: RoomData;
  siblingRooms?: RoomData[];
}

const RoomMaintenancePanel = ({ room, siblingRooms = [] }: RoomMaintenancePanelProps) => {
  const [note, setNote] = useState('');
  const [updateRoomMaintenanceStatus, { isLoading: isUpdatingStatus }] =
    useUpdateRoomMaintenanceStatusMutation();
  const [duplicateRoom, { isLoading: isDuplicating }] = useDuplicateRoomMutation();
  const [bulkUpdateRoomCapacity, { isLoading: isBulkUpdating }] =
    useBulkUpdateRoomCapacityMutation();

  async function onToggleMaintenance() {
    const idToast = toast.loading('Updating maintenance status...');
    try {
      await updateRoomMaintenanceStatus({
        id: room._id,
        isActive: !room.isActive,
        note,
      }).unwrap();
      toast.success('Maintenance status updated', { id: idToast });
    } catch (error) {
      console.error('Failed to update maintenance status', error);
      toast.error('Failed to update maintenance status', { id: idToast });
    }
  }

  async function onDuplicate() {
    const idToast = toast.loading('Duplicating room...');
    try {
      await duplicateRoom({
        id: room._id,
        name: `${room.name} (copy)`,
      }).unwrap();
      toast.success('Room duplicated', { id: idToast });
    } catch (error) {
      console.error('Failed to duplicate room', error);
      toast.error('Failed to duplicate room', { id: idToast });
    }
  }

  async function onNormalizeCapacity() {
    const idToast = toast.loading('Normalizing capacity...');
    try {
      await bulkUpdateRoomCapacity(
        siblingRooms.map((sibling) => ({
          id: sibling._id,
          capacity: room.capacity ?? 0,
        })),
      ).unwrap();
      toast.success('Capacity normalized for all sibling rooms', { id: idToast });
    } catch (error) {
      console.error('Failed to normalize capacity', error);
      toast.error('Failed to normalize capacity', { id: idToast });
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800 space-y-4">
      <div>
        <h3 className="font-semibold">Maintenance</h3>
        <p className="text-sm text-muted-foreground">
          Current status: {room.isActive ? 'Active' : 'Under maintenance'}
        </p>
      </div>

      <Input
        placeholder="Maintenance note..."
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      <div className="flex gap-2 flex-wrap">
        <Button variant="default" onClick={onToggleMaintenance} disabled={isUpdatingStatus}>
          {room.isActive ? 'Mark under maintenance' : 'Mark as active'}
        </Button>
        <Button variant="secondary" onClick={onDuplicate} disabled={isDuplicating}>
          Duplicate room
        </Button>
        <Button
          variant="outline"
          onClick={onNormalizeCapacity}
          disabled={isBulkUpdating || siblingRooms.length === 0}
        >
          Normalize sibling capacity
        </Button>
      </div>
    </div>
  );
};

export default RoomMaintenancePanel;
