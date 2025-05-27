import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { StudentSampleData } from '../data.student';
import { TedTeamSampleData } from '../data.tedTeam';
import { CoachSampleData } from '../data.coach';
import { AdminSampleData } from '../data.admin';
import { columns } from '../columns/account-management';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom-tabs';

const AccountManagement = () => {
  return (
    <div>
      <Tabs defaultValue="Student" className="w-[100%]">
        <TabsList>
          <TabsTrigger className="!shadow-none" value="Student">Student</TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Ted-Team">Ted-Team</TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Coach">Coach</TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Admin">Admin</TabsTrigger>
        </TabsList>
        <TabsContent className="-mt-1" value="Student">
          <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
            <TitlePage
              title="Manage Students"
              href="/account-management/student/add"
              contentHref="Add Student"
            />
            <DataTable data={StudentSampleData} columns={columns} />
          </div>
        </TabsContent>
        <TabsContent className="-mt-1" value="Ted-Team">
          <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
            <TitlePage
              title="Manage Ted-Team"
              href="/account-management/ted-team/add"
              contentHref="Add Ted-Team Member"
            />
            <DataTable data={TedTeamSampleData} columns={columns} />
          </div>
        </TabsContent>
        <TabsContent className="-mt-1" value="Coach">
          <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
            <TitlePage
              title="Manage Coach"
              href="/account-management/coach/add"
              contentHref="Add Coach"
            />
            <DataTable data={CoachSampleData} columns={columns} />
          </div>
        </TabsContent>
        <TabsContent className="-mt-1" value="Admin">
          <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
            <TitlePage
              title="Manage Admin"
              href="/account-management/admin/add"
              contentHref="Add Admin"
            />
            <DataTable data={AdminSampleData} columns={columns} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountManagement;
