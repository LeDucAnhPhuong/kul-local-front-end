import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { questions as defaultQuestions } from '../../data.question';
import { useNavigate } from 'react-router-dom';
type Answer = { text: string; isCorrect: boolean };
type QuestionItem = { question: string; answers: Answer[] };

export default function AddQuestion() {
  const { quizId } = useParams();
  const QUIZ_STORAGE_KEY = `quiz_questions_${quizId}`;
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  const mapQuestionToState = (q: typeof defaultQuestions[0]): QuestionItem => {
    const options = q.options.length === 4 ? q.options : [...q.options, ...Array(4 - q.options.length).fill('')];
    const answersMapped = options.map((opt) => ({
      text: opt,
      isCorrect: opt === q.correct_answer,
    }));
    return {
      question: q.content,
      answers: answersMapped,
    };
  };

  useEffect(() => {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as QuestionItem[];
      setQuestionList(parsed);
      if (parsed.length > 0) {
        setSelectedIndex(0);
        setQuestionText(parsed[0].question);
        setAnswers(parsed[0].answers);
      }
    } else if (quizId) {
      const filtered = defaultQuestions.filter((q) => q.quiz_id === quizId);
      const mapped = filtered.map(mapQuestionToState);
      setQuestionList(mapped);
      if (mapped.length > 0) {
        setSelectedIndex(0);
        setQuestionText(mapped[0].question);
        setAnswers(mapped[0].answers);
      }
    }
  }, [quizId]);

  const handleSelectQuestion = (index: number) => {
    setSelectedIndex(index);
    setQuestionText(questionList[index].question);
    setAnswers(questionList[index].answers);
    // setSidebarOpen(false); // ẩn sidebar trên mobile khi chọn câu hỏi
  };

  const handleAnswerChange = (index: number, field: keyof Answer, value: string | boolean) => {
    const updated = [...answers];
    if (field === 'text' && typeof value === 'string') updated[index].text = value;
    else if (field === 'isCorrect' && typeof value === 'boolean') {
      if (value) updated.forEach((_, i) => (updated[i].isCorrect = i === index));
      else updated[index].isCorrect = false;
    }
    setAnswers(updated);

    const updatedList = [...questionList];
    updatedList[selectedIndex].answers = updated;
    setQuestionList(updatedList);
  };

  useEffect(() => {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(questionList));
  }, [questionList]);

  const handleChangeQuestionText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionText(e.target.value);
    const updatedList = [...questionList];
    updatedList[selectedIndex].question = e.target.value;
    setQuestionList(updatedList);
  };

  const handleSave = () => {
    const data: QuestionItem = { question: questionText, answers };
    const updatedList = [...questionList];
    if (selectedIndex >= 0 && selectedIndex < updatedList.length) {
      updatedList[selectedIndex] = data;
      setQuestionList(updatedList);
    }
  };
useEffect(() => {
  console.log('quizId:', quizId);
  console.log('defaultQuestions:', defaultQuestions);
  if (quizId) {
    const filtered = defaultQuestions.filter((q) => q.quiz_id === quizId);
    console.log('filtered questions:', filtered);
  }
}, [quizId]);

  const handleAddNew = () => {
    if (
      questionText.trim() !== '' &&
      answers.filter((ans) => ans.text.trim() !== '').length >= 2 &&
      answers.some((ans) => ans.isCorrect)
    ) {
      handleSave();

      const newQuestion: QuestionItem = {
        question: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      };

      setQuestionList((prev) => [...prev, newQuestion]);
      setSelectedIndex(questionList.length);
      setQuestionText('');
      setAnswers(newQuestion.answers);
    }
  };

  const handleDelete = () => {
    const updated = questionList.filter((_, idx) => idx !== selectedIndex);
    setQuestionList(updated);
    if (updated.length > 0) {
      const newIndex = Math.min(selectedIndex, updated.length - 1);
      setSelectedIndex(newIndex);
      setQuestionText(updated[newIndex].question);
      setAnswers(updated[newIndex].answers);
    } else {
      setSelectedIndex(0);
      setQuestionText('');
      setAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    }
  };

  return (
    <div>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex bg-white text-gray-800 h-[400px]">
          {/* Sidebar trái */}
          <div className="w-56 border-r border-gray-200 p-4 flex flex-col justify-between shadow-sm">
            <ScrollArea className="h-4/5 w-full rounded-md border p-4">
              <div className="space-y-2 overflow-y-auto mb-2">
                {questionList.map((_, idx) => (
                  <Button
                    key={idx}
                    variant={idx === selectedIndex ? 'default' : 'outline'}
                    className={`w-full justify-start ${
                      idx === selectedIndex
                        ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
                    onClick={() => handleSelectQuestion(idx)}
                    style={{ marginBottom: 8 }}
                  >
                    Question {idx + 1}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white w-full"
                onClick={() => navigate('/quiz')}
              >
                Exit
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-white">
            <Textarea
              placeholder="Enter question..."
              value={questionText}
              onChange={handleChangeQuestionText}
              className="mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              {answers.map((ans, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg hover:bg-gray-100 transition-colors mt-4"
                >
                  <Input
                    placeholder={`Answer ${index + 1}`}
                    value={ans.text}
                    onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="checkbox"
                    checked={ans.isCorrect}
                    onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                    className="w-5 h-5 accent-green-500"
                    title="Correct answer"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save Question
              </Button>
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
                Delete Question
              </Button>
            </div>
          </div>

          {/* Sidebar phải */}
          <div className="w-64 bg-white border-l border-gray-200 p-4 space-y-4 shadow-sm">
            <div className="flex justify-end mb-2">
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleAddNew}>
                Add Question
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet */}
      <div className="hidden md:block lg:hidden !w-full">
        <div className="flex bg-white text-gray-800 max-h-screen">
          {/* Sidebar trái */}
          <div className="border-r border-gray-200 p-4 flex flex-col justify-between shadow-sm">
            <ScrollArea className="h-4/5 w-full rounded-md border p-2">
              <div className="space-y-2 overflow-y-auto mb-2">
                {questionList.map((_, idx) => (
                  <Button
                    key={idx}
                    variant={idx === selectedIndex ? 'default' : 'outline'}
                    className={`w-full justify-start ${
                      idx === selectedIndex
                        ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
                    onClick={() => handleSelectQuestion(idx)}
                  >
                    Question {idx + 1}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white w-full"
                onClick={() => navigate('/quiz')}
              >
                Exit
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <Textarea
              placeholder="Enter question..."
              value={questionText}
              onChange={handleChangeQuestionText}
              className="mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {answers.map((ans, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg hover:bg-gray-100 transition-colors mt-4"
                >
                  <Input
                    placeholder={`Answer ${index + 1}`}
                    value={ans.text}
                    onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="checkbox"
                    checked={ans.isCorrect}
                    onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                    className="w-5 h-5 accent-green-500"
                    title="Correct answer"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save Question
              </Button>
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
                Delete Question
              </Button>
            </div>
          </div>

          {/* Sidebar phải */}
          <div className="w-64 bg-white border-l border-gray-200 p-4 space-y-4 shadow-sm">
            <div className="flex justify-end mb-2">
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleAddNew}>
                Add Question
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col bg-white p-4 space-y-4">
          <ScrollArea className="max-h-40 rounded-md border p-2">
            <div className="space-y-2 overflow-y-auto mb-2">
              {questionList.map((_, idx) => (
                <Button
                  key={idx}
                  variant={idx === selectedIndex ? 'default' : 'outline'}
                  className={`w-full justify-start ${
                    idx === selectedIndex
                      ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
                  onClick={() => handleSelectQuestion(idx)}
                >
                  Question {idx + 1}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <Textarea
            placeholder="Enter question..."
            value={questionText}
            onChange={handleChangeQuestionText}
            className="mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="space-y-2">
            {answers.map((ans, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Input
                  placeholder={`Answer ${index + 1}`}
                  value={ans.text}
                  onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="checkbox"
                  checked={ans.isCorrect}
                  onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                  className="w-5 h-5 accent-green-500"
                  title="Correct answer"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-2">
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white flex-1">
              Save
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white flex-1">
              Delete
            </Button>
            <Button onClick={handleAddNew} className="bg-green-500 hover:bg-green-600 text-white flex-1">
              Add
            </Button>
          </div>

          <Button
            className="bg-red-500 hover:bg-red-600 text-white w-full"
            onClick={() => navigate('/quiz')}
          >
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
