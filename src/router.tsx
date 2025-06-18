import { Route, Routes } from 'react-router';

import DashboardLayout from './components/layouts/dashboard/layout';
import LandingLayout from './components/layouts/landing/layout';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';
import AccountManagementPage from './pages/dashboard/account-management';
import AddStudentPage from './pages/dashboard/account-management/student/student.add';
import AddTedTeamPage from './pages/dashboard/account-management/ted-team/ted-team.add';
import AddCoachPage from './pages/dashboard/account-management/coach/coach.add';
import AddAdminPage from './pages/dashboard/account-management/admin/admin.add';
import DashBoardHome from './pages/dashboard/DashBoardHome';
import QuizzesView from './pages/dashboard/student/Quizzes/QuizzesView';
import ScheduleView from './features/student-management/components/schedule-view';
import DoQuiz from "./pages/dashboard/student/Quizzes/DoQuiz";
import QuizInterface from "./features/student-management/components/DoQuizView";
import NewsView from "./pages/dashboard/student/News/NewsView";
import TedPersonalPage from './pages/dashboard/tedteam/personal';
import TedRegisterPage from './pages/dashboard/tedteam/register';
import SignOut from './pages/sign-out';

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
          <Route path="/personal-tedteam" element={<TedPersonalPage />} />
          <Route path="/register-tedteam" element={<TedRegisterPage />} />

          <Route path="/list-news" element={<NewsView />} />

          {/* Uncomment the following lines if you want to include these routes */}
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
        <Route path="/quiz/:id" element={<QuizInterface />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-out" element={<SignOut />} />
      </Routes>
    </>
  );
}

export default Router;
