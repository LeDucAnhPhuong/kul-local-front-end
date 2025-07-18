import type { ColumnDef } from '@tanstack/react-table';
import type { AssignmentSubmission } from '../types/assignment';
export const columns: ColumnDef<AssignmentSubmission>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    cell: ({ row }) => row.getValue('userId'),
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted At',
    cell: ({ row }) => new Date(row.getValue('submittedAt')).toLocaleString(),
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => (row.getValue('score') !== null ? row.getValue('score') : '-'),
  },
  {
    accessorKey: 'feedback',
    header: 'Feedback',
    cell: ({ row }) => row.getValue('feedback') || '-',
  },

];
