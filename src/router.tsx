import { Route, Routes } from 'react-router';

import DashboardLayout from './components/layouts/dashboard/layout';
import LandingLayout from './components/layouts/landing/layout';
import StudentManagement from './pages/dashboard/student-management';
import TeacherManagement from './pages/dashboard/teacher-management';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';
import ExampleUI from './features/example-ui/components';
import AccountManagementPage from './pages/dashboard/account-management';
import AddStudentPage from './pages/dashboard/account-management/student/student.add';
import AddTedTeamPage from './pages/dashboard/account-management/ted-team/ted-team.add';
import AddCoachPage from './pages/dashboard/account-management/coach/coach.add';
import AddAdminPage from './pages/dashboard/account-management/admin/admin.add';
import DashBoardHome from './pages/dashboard/DashBoardHome';

function Router() {
  return (
    <>
      <Routes>
         <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashBoardHome />} />
          {/* <Route path="/example-ui" element={<ExampleUI />} />
          <Route path="/student-management" element={<StudentManagement />} />
          <Route path="/teacher-management" element={<TeacherManagement />} /> */}
          <Route path="/account-management">
            <Route path="" element={<AccountManagementPage />} />
            <Route path="student/add" element={<AddStudentPage />} />
            <Route path="ted-team/add" element={<AddTedTeamPage />} />
            <Route path="coach/add" element={<AddCoachPage />} />
            <Route path="admin/add" element={<AddAdminPage />} />
          </Route>
        </Route>
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </>
  );
}

export default Router;
