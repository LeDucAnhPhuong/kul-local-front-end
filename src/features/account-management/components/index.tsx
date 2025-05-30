import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom-tabs';
import StudentManagement from './student.management';
import TedTeamManagement from './tedteam.management';
import CoachManagement from './coach.management';
import AdminManagement from './admin.management';

const AccountManagement = () => {
  return (
    <div>
      <Tabs defaultValue="Student" className="w-[100%]">
        <TabsList>
          <TabsTrigger className="!shadow-none" value="Student">
            Student
          </TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Ted-Team">
            Ted-Team
          </TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Coach">
            Coach
          </TabsTrigger>
          <TabsTrigger className="!shadow-none" value="Admin">
            Admin
          </TabsTrigger>
        </TabsList>
        <TabsContent className="-mt-1" value="Student">
          <StudentManagement />
        </TabsContent>
        <TabsContent className="-mt-1" value="Ted-Team">
          <TedTeamManagement />
        </TabsContent>
        <TabsContent className="-mt-1" value="Coach">
          <CoachManagement />
        </TabsContent>
        <TabsContent className="-mt-1" value="Admin">
          <AdminManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountManagement;
