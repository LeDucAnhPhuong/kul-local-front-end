import ScheduleView from "@/features/student-management/components/schedule-view";
import QuizzesUI from "@/features/student-management/components/title-quizzes-view";


function ScheduleManagement() {
  return <ScheduleView />;
}

export default ScheduleManagement;

function QuizzesManagement() {
  return <QuizzesUI />;
} 
export { QuizzesManagement };