// import { Textarea } from './textarea';
// import { Input } from '@/components/ui/input';
// import type { AnswerItem } from './addQuestion';
// export const CenterEditor = ({
//   questionText,
//   answers,
//   timeLimit,
//   handleChange,
//   handleAnswerChange,
// }: {
//   questionText: string;
//   answers: AnswerItem[];
//   timeLimit: string;
//   handleChange: (field: string, value: any) => void;
//   handleAnswerChange: (index: number, field: string, value: any) => void;
// }) => {
//   return (
//     <div className="p-4 space-y-4">
//       <Textarea
//         placeholder="Enter question here..."
//         value={questionText}
//         onChange={(e) => handleChange('questionText', e.target.value)}
//       />
//       <div className="space-y-2">
//         {answers.map((ans, index) => (
//           <div key={index} className="flex items-center gap-2">
//             <Input
//               placeholder={`Answer ${index + 1}`}
//               value={ans.text}
//               onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
//             />
//             <label className="flex items-center gap-1 text-sm">
//               <input
//                 type="checkbox"
//                 checked={ans.isCorrect}
//                 onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
//                 className="w-4 h-4"
//               />
//               Correct
//             </label>
//           </div>
//         ))}
//       </div>
//       <Input
//         type="number"
//         placeholder="Time limit (seconds)"
//         value={timeLimit}
//         onChange={(e) => handleChange('timeLimit', e.target.value)}
//       />
//     </div>
//   );
// };
