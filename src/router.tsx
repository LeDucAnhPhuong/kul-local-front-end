import { Route, Routes } from "react-router"

import DashboardLayout from './components/layouts/dashboard/layout';
import LandingLayout from './components/layouts/landing/layout';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';
import AccountManagementPage from './pages/dashboard/admin/account-management';
import AddStudentPage from './pages/dashboard/admin/account-management/student/student.add';
import AddTedTeamPage from './pages/dashboard/admin/account-management/ted-team/ted-team.add';
import AddCoachPage from './pages/dashboard/admin/account-management/coach/coach.add';
import AddAdminPage from './pages/dashboard/admin/account-management/admin/admin.add';
import DashBoardHome from './pages/dashboard/DashBoardHome';
import QuizzesView from './pages/dashboard/student/Quizzes/QuizzesView';
import ScheduleView from './features/student-management/components/schedule-view';
import ClassManagementPage from './pages/dashboard/admin/class-management';
import AddClassPage from './pages/dashboard/admin/class-management/class.add';
import ClassDetailPage from "./pages/dashboard/admin/class-management/class.detail";
import SlotManagementPage from "./pages/dashboard/admin/slot-management";
import AddSlotPage from "./pages/dashboard/admin/slot-management/slot.add";

function Router() {
  return (
    <>
      <Routes>
         <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashBoardHome />} />
          <Route path="/schedule-student" element={<ScheduleView />} />
          <Route path="/quizzes-student" element={<QuizzesView />} />
          {/* Uncomment the following lines if you want to include these routes */}
          {/* <Route path="/example-ui" element={<ExampleUI />} />
          <Route path="/student-management" element={<StudentManagement />} />
          <Route path="/teacher-management" element={<TeacherManagement />} /> */}
          <Route path="/class-management">
            <Route path="" element={<ClassManagementPage />} />
            <Route path="add" element={<AddClassPage />} />
            <Route path="class/:id" element={<ClassDetailPage />} />
          </Route>
          <Route path="/slot-management">
            <Route path="" element={<SlotManagementPage />} />
            <Route path="add" element={<AddSlotPage />} />
          </Route>
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
  )
}

export default Router
