import TitlePage from '@/components/ui/title-page';
import {
  useAddStudentToClassMutation,
  useGetClassInfoQuery,
} from '@/features/class-management/api.class';
import MyForm from './AddForm';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

const AddStudentIntoClass = () => {
  const [addStudentToClass] = useAddStudentToClassMutation();

  async function onAddStudentIntoClass(data: { email: string }) {
    const idToast = toast.loading('Creating class...');
    try {
      await addStudentToClass({
        email: data.email,
        classId: classInfo.id,
      }).unwrap();
      toast.success('Add student into class successfully', {
        id: idToast,
      });
    } catch (error) {
      toast.error('Failed to add student into class', {
        id: idToast,
      });
    }
  }

  const { id } = useParams();
  const { classInfo, isFetching_class } = useGetClassInfoQuery(id, {
    selectFromResult: ({ data, isFetching }) => ({
      classInfo: data?.data || {},
      isFetching_class: isFetching,
    }),
  });

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title={`Add Student Into Class ${classInfo.name}`} />
      <MyForm onAdd={onAddStudentIntoClass} />
    </div>
  );
};

export default AddStudentIntoClass;
