// import { useEffect, useState } from "react";
// import { LeftSidebar } from "./leftSidebar";
// import { CenterEditor } from "./centerEditor";
// import { RightPanel } from "./rightPanel";

// export default function AddQuestion() {
//   const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [questionText, setQuestionText] = useState("");
//   const [answers, setAnswers] = useState<AnswerItem[]>([]);
//   const [timeLimit, setTimeLimit] = useState("");

//   useEffect(() => {
//     const saved = localStorage.getItem("questions");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setQuestionList(parsed);
//       setSelectedIndex(0);
//       loadQuestion(parsed[0]);
//     } else {
//       handleAddNew();
//     }
//   }, []);

//   const loadQuestion = (q: QuestionItem) => {
//     setQuestionText(q.question);
//     setAnswers(q.answers);
//     setTimeLimit(q.timeLimit);
//   };

//   const handleSave = () => {
//     const updated = [...questionList];
//     updated[selectedIndex] = {
//       question: questionText,
//       answers,
//       timeLimit,
//     };
//     setQuestionList(updated);
//     localStorage.setItem("questions", JSON.stringify(updated));
//   };

//   const handleAddNew = () => {
//     const newQuestion: QuestionItem = {
//       question: "",
//       answers: Array(4).fill({ text: "", isCorrect: false }),
//       timeLimit: "",
//     };
//     const updated = [...questionList, newQuestion];
//     setQuestionList(updated);
//     setSelectedIndex(updated.length - 1);
//     loadQuestion(newQuestion);
//   };

//   const handleDelete = () => {
//     const updated = questionList.filter((_, i) => i !== selectedIndex);
//     const newIndex = Math.max(selectedIndex - 1, 0);
//     setQuestionList(updated);
//     setSelectedIndex(newIndex);
//     loadQuestion(updated[newIndex] || {
//       question: "",
//       answers: Array(4).fill({ text: "", isCorrect: false }),
//       timeLimit: "",
//     });
//     localStorage.setItem("questions", JSON.stringify(updated));
//   };

//   const handleAnswerChange = (index: number, field: string, value: any) => {
//     const updated = [...answers];
//     updated[index] = { ...updated[index], [field]: value };
//     setAnswers(updated);
//   };

//   return (
//     <div className="flex flex-col lg:flex-row h-screen">
//       <div className="lg:w-1/5 md:w-1/4 sm:w-full">
//         <LeftSidebar
//           questionList={questionList}
//           selectedIndex={selectedIndex}
//           handleSelectQuestion={(idx) => {
//             setSelectedIndex(idx);
//             loadQuestion(questionList[idx]);
//           }}
//         />
//       </div>
//       <div className="flex-1">
//         <CenterEditor
//           questionText={questionText}
//           answers={answers}
//           timeLimit={timeLimit}
//           handleChange={(field, value) => {
//             if (field === "questionText") setQuestionText(value);
//             if (field === "timeLimit") setTimeLimit(value);
//           }}
//           handleAnswerChange={handleAnswerChange}
//         />
//       </div>
//       <RightPanel
//         handleAddNew={handleAddNew}
//         handleSave={handleSave}
//         handleDelete={handleDelete}
//       />
//     </div>
//   );
// }

// // types.ts
// export interface AnswerItem {
//   text: string;
//   isCorrect: boolean;
// }

// export interface QuestionItem {
//   question: string;
//   answers: AnswerItem[];
//   timeLimit: string;
// }