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
import AccountManagementPage from './pages/dashboard/admin/account-management';
import AddStudentPage from './pages/dashboard/admin/account-management/student/student.add';
import AddTedTeamPage from './pages/dashboard/admin/account-management/ted-team/ted-team.add';
import AddCoachPage from './pages/dashboard/admin/account-management/coach/coach.add';
import AddAdminPage from './pages/dashboard/admin/account-management/admin/admin.add';
import DashBoardHome from './pages/dashboard/DashBoardHome';
import Assignment from './pages/dashboard/teacher/assignment';
import SubmissionDetailPageWrapper from './pages/dashboard/teacher/submission-detail';
import AddQuestion from './features/teacher/components/quiz/addQuestion';
import QuizzesView from './pages/dashboard/student/Quizzes/QuizzesView';
import ScheduleView from './features/student-management/components/schedule-view';
import DoQuiz from './pages/dashboard/student/Quizzes/DoQuiz';
import QuizInterface from './features/student-management/components/DoQuizView';
import NewsView from './pages/dashboard/student/News/NewsView';
import TedPersonalPage from './pages/dashboard/tedteam/personal';
import TedRegisterPage from './pages/dashboard/tedteam/register';
import SignOut from './pages/sign-out';
import ClassManagementPage from './pages/dashboard/admin/class-management';
import AddClassPage from './pages/dashboard/admin/class-management/class.add';
import ClassDetailPage from './pages/dashboard/admin/class-management/class.detail';
import SlotManagementPage from './pages/dashboard/admin/slot-management';
import AddSlotPage from './pages/dashboard/admin/slot-management/slot.add';
import AddStudentIntoClassPage from './pages/dashboard/admin/class-management/AddStudentIntoClassPage';
import ScheduleManagementPage from './pages/dashboard/admin/schedule-management';
import AddSchedulePage from './pages/dashboard/admin/schedule-management/schedule.add';
import TedTeamRegistrationsPage from './features/register-management/rgister-management';
import RoomManagementPage from './pages/dashboard/admin/room-management';
import AddRoomPage from './pages/dashboard/admin/room-management/room.add';

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
          <Route path="/view-quiz" element={<Quiz />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/AddQuestion/:quizId" element={<AddQuestion />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/submissions/:id" element={<SubmissionDetailPageWrapper />} />
          <Route path="ClassList" element={<ClassManagementPage />} />
          <Route path="/class-management">
            <Route path="" element={<ClassManagementPage />} />
            <Route path="add" element={<AddClassPage />} />
            <Route path=":id" element={<ClassDetailPage />} />
            <Route path=":id/add-student" element={<AddStudentIntoClassPage />} />
          </Route>
          <Route path="/schedule-management">
            <Route path="" element={<ScheduleManagementPage />} />
            <Route path="add" element={<AddSchedulePage />} />
          </Route>
          <Route path="/room-management">
            <Route path="" element={<RoomManagementPage />} />
            <Route path="add" element={<AddRoomPage />} />
          </Route>
          <Route path="/register-management">
            <Route path="" element={<TedTeamRegistrationsPage />} />
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
        <Route path="/quiz/:id" element={<QuizInterface />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-out" element={<SignOut />} />
      </Routes>
    </>
  );
}

export default Router;
