import DataTable from '@/components/data-table/data-table';
import { columns } from '../columns/account-management';
import { useExportUserMutation, useGetStudentQuery } from '../api.user';
import type { StudentData } from '../data.student';
import { Button } from '@/components/ui/button';
import { Download, PlusIcon } from 'lucide-react';
import useRouter from '@/hooks/use-router';
import ExcelUploadModal from './import-user';

const StudentManagement = () => {
  const router = useRouter();
  const [exportUser, { isLoading: isExporting }] = useExportUserMutation();
  const { students, isFetching } = useGetStudentQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      students:
        data?.data?.map((item: StudentData) => ({
          ...item,
          name:
            item.firstName || item.lastName
              ? `${item.lastName ?? ''} ${item.firstName ?? ''}`
              : 'N/A',
        })) || [],
      isFetching,
    }),
  });

  const handleExport = async () => {
    try {
      const res = await exportUser(undefined).unwrap();

      const blobUrl = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Users_${new Date().toISOString()}.xlsx`; // 👈 Tên file tải về
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to export students:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <div className="space-y-4 mb-4">
        <h3 className="text-2xl font-bold mb-4">Manage Students</h3>
        <div className="flex justify-end gap-4">
          <ExcelUploadModal />
          <Button
            isLoading={isExporting}
            onClick={handleExport}
            className="h-8 px-2 lg:px-3"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className="h-8 px-2 lg:px-3"
            variant="outline"
            onClick={() => {
              router.push('/account-management/student/add');
            }}
          >
            <PlusIcon className="h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>
      <DataTable data={students} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default StudentManagement;
