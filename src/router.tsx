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
import QuizzesView from './pages/dashboard/student/Quizzes/QuizzesView';
import ScheduleView from './features/student-management/components/schedule-view';
import QuizInterface from './features/student-management/components/quiz/DoQuizView';
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
import ClassListUi from '@/features/tedteam/components/ui/classList';
import DetailClassPage from '@/pages/dashboard/tedteam/detailClass';
import QuizModule from './features/teacher/components/make-quiz/quiz-page';
import Leaderboardpage from './pages/dashboard/student/leaderboard';
import RoomManagementPage from './pages/dashboard/admin/room-management';
import AddRoomPage from './pages/dashboard/admin/room-management/room.add';
import NewsCoachModule from './features/teacher/components/news/NewsCoachModule';
import ScoreForm from './features/teacher/components/news/grade-news';
import NewsModule from './features/student-management/components/news/NewsModule';
import NewsDetailPage from './features/student-management/components/news/detail-news';

function Router() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="index" element={<DashBoardHome />} />
          <Route path="/dashboard" element={<DashBoardHome />} />
          <Route path="/schedule-student" element={<ScheduleView />} />
          <Route path="/quizzes-student" element={<QuizzesView />} />
          <Route path="/personal-tedteam" element={<TedPersonalPage />} />
          <Route path="/register-tedteam" element={<TedRegisterPage />} />

          <Route path="/list-news" element={<NewsModule />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />

          {/* Uncomment the following lines if you want to include these routes */}
          {/* <Route path="/example-ui" element={<ExampleUI />} />
          <Route path="/student-management" element={<StudentManagement />} />
          <Route path="/teacher-management" element={<TeacherManagement />} /> */}
          <Route path="/view-quiz" element={<Quiz />} />
          <Route path="/grade-news">
            <Route path="" element={<NewsCoachModule />} />
            <Route path=":id" element={<ScoreForm />} />
          </Route>
          <Route path="/leaderboard" element={<Leaderboardpage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/make-quiz/:quizId" element={<QuizModule />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/submissions/:id" element={<SubmissionDetailPageWrapper />} />
          <Route path="/detail-class/:id" element={<DetailClassPage />} />
          <Route path="/ClassList" element={<ClassManagementPage />} />
          <Route path="/view-classlist" element={<ClassListUi />} />
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
