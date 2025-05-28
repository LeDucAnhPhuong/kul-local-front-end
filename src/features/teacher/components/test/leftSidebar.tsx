// import type { QuestionItem } from "./addQuestion";
// export const LeftSidebar = ({
//   questionList,
//   selectedIndex,
//   handleSelectQuestion,
// }: {
//   questionList: QuestionItem[];
//   selectedIndex: number;
//   handleSelectQuestion: (index: number) => void;
// }) => {
//   return (
//     <div className="h-full overflow-y-auto border-r border-white/10 p-2">
//       {questionList.map((q, idx) => (
//         <button
//           key={idx}
//           onClick={() => handleSelectQuestion(idx)}
//           className={`w-full py-2 px-3 mb-1 rounded text-left text-sm border ${
//             selectedIndex === idx
//               ? "bg-blue-500 text-white"
//               : "hover:bg-white/10 text-white/80 border-white/10"
//           }`}
//         >
//           {q.question.slice(0, 20) || `Question ${idx + 1}`}
//         </button>
//       ))}
//     </div>
//   );
// };
