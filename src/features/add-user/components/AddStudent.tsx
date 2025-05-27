import TitlePage from '@/components/ui/title-page';
import MyForm from '@/components/ui/add-account-form';
const AddStudent = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Student" />
      <MyForm/>
    </div>
  );
};

export default AddStudent;
