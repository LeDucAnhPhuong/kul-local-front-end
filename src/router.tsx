import { Route, Routes } from 'react-router';

import DashboardLayout from './components/layouts/dashboard/layout';
import LandingLayout from './components/layouts/landing/layout';
  // import ScheduleView from './pages/dashboard/student/Schedule/ScheduleView';
  // import QuizzesView from './pages/dashboard/student/Quizzes/QuizzesView';
// import TeacherManagement from './pages/dashboard/teacher';
// import BookingPage from './pages/booking';
import { Schedule } from './pages/dashboard/teacher/schedule';
import { Quiz } from './pages/dashboard/teacher/quiz';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';
import AccountManagementPage from './pages/dashboard/account-management';
import AddStudentPage from './pages/dashboard/account-management/student/student.add';
import AddTedTeamPage from './pages/dashboard/account-management/ted-team/ted-team.add';
import AddCoachPage from './pages/dashboard/account-management/coach/coach.add';
import AddAdminPage from './pages/dashboard/account-management/admin/admin.add';
import DashBoardHome from './pages/dashboard/DashBoardHome';
import Assignment from './pages/dashboard/teacher/assignment';
import SubmissionDetailPageWrapper from './pages/dashboard/teacher/submission-detail';
import AddQuestion from './features/teacher/components/quiz/addQuestion';
import QuizzesView from './pages/dashboard/student/Quizzes/QuizzesView';
import ScheduleView from './features/student-management/components/schedule-view';
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

          {/* Uncomment the following lines if you want to include these routes */}
          {/* <Route path="/example-ui" element={<ExampleUI />} />
          <Route path="/student-management" element={<StudentManagement />} />
          <Route path="/teacher-management" element={<TeacherManagement />} /> */}
          <Route path="/view-quiz" element={<Quiz />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/AddQuestion/:quizId" element={<AddQuestion />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/submissions/:id" element={<SubmissionDetailPageWrapper />} />
          <Route path="/account-management">
            <Route path="" element={<AccountManagementPage />} />
            <Route path="student/add" element={<AddStudentPage />} />
            <Route path="ted-team/add" element={<AddTedTeamPage />} />
            <Route path="coach/add" element={<AddCoachPage />} />
            <Route path="admin/add" element={<AddAdminPage />} />
          </Route>
        </Route>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-out" element={<SignOut />} />
      </Routes>
    </>
  );
}

export default Router;
