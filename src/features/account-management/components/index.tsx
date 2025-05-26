import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { StudentSampleData } from '../data.student';
import { TedTeamSampleData } from '../data.tedTeam';
import { CoachSampleData } from '../data.coach';
import { AdminSampleData } from '../data.admin';
import { columns } from '../columns/account-management';
import { useState } from 'react';

const AccountManagement = () => {
  const [currentlySelected, setCurrentlySelected] = useState('Student');
  const handleSelectionChange = (selection: string) => {
    setCurrentlySelected(selection);
  };
  const data =
    currentlySelected === 'Student'
      ? StudentSampleData
      : currentlySelected === 'Ted-Team'
      ? TedTeamSampleData
      : currentlySelected === 'Coach'
      ? CoachSampleData
      : AdminSampleData;

  const urlAddButton = `/account-management/${currentlySelected.toLowerCase()}/add`;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-[-1px] ml-4 ">
        {['Student', 'Ted-Team', 'Coach', 'Admin'].map((role) => (
          <button
            key={role}
            className={`text-base rounded-t-lg px-5 py-1.5 cursor-pointer ${
              currentlySelected === role ? 'bg-white' : ''
            } w-[97%] sm:w-[calc(49%-0.25rem)] md:w-auto`}
            onClick={() => handleSelectionChange(role)}
            type="button"
          >
            {role}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <TitlePage
          title={`Manage ${currentlySelected}`}
          href={urlAddButton}
          contentHref={`Add ${currentlySelected}`}
        />
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
};

export default AccountManagement;
