import DataTable from '@/components/data-table/data-table'
import TitlePage from '@/components/ui/title-page'
import type { ClassListView } from '../classData' // Import type từ classData

interface SlotClassListProps {
  classes: ClassListView[];
}

const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: any) => (row.original.isActive ? "Active" : "Inactive"),
  },
]

export const SlotClassList = ({ classes = [] }: SlotClassListProps) => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Class List" />
      <DataTable data={classes} columns={columns} />
    </div>
  )
}

export default SlotClassList;