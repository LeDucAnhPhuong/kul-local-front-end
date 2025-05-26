import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from './textarea';
import { useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Answer = {
  text: string;
  isCorrect: boolean;
};

type QuestionItem = {
  question: string;
  answers: Answer[];
  timeLimit: number;
};

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
  const [timeLimit, setTimeLimit] = useState('20');
  const [questionList, setQuestionList] = useState<QuestionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Load quiz from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as QuestionItem[];
      setQuestionList(parsed);
      if (parsed.length > 0) {
        setSelectedIndex(0);
        setQuestionText(parsed[0].question);
        setAnswers(parsed[0].answers);
        setTimeLimit(parsed[0].timeLimit.toString());
      }
    }
  }, []);

  // Save to localStorage every time questionList changes
  useEffect(() => {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(questionList));
  }, [questionList]);

  const handleAnswerChange = (index: number, field: keyof Answer, value: string | boolean) => {
    const updated = [...answers];
    if (field === 'text' && typeof value === 'string') {
      updated[index].text = value;
    } else if (field === 'isCorrect' && typeof value === 'boolean') {
      updated[index].isCorrect = value;
    }
    setAnswers(updated);
  };

  const resetForm = () => {
    setQuestionText('');
    setAnswers([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setTimeLimit('20');
  };

  const handleSave = () => {
    const data: QuestionItem = {
      question: questionText,
      answers,
      timeLimit: Number.parseInt(timeLimit),
    };
    // Nếu questionList chưa có phần tử tại selectedIndex thì thêm mới
    let updatedList = [...questionList];
    if (selectedIndex >= 0 && selectedIndex < updatedList.length) {
      updatedList[selectedIndex] = data;
    } else {
      updatedList.push(data);
      setSelectedIndex(updatedList.length - 1);
    }
    setQuestionList(updatedList);
  };

  const handleAddNew = () => {
    // Lưu câu hỏi hiện tại trước khi thêm mới
    handleSave();

    // Thêm câu hỏi mới với giá trị mặc định
    const newQuestion: QuestionItem = {
      question: '',
      answers: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
      timeLimit: 20,
    };

    // Cập nhật list và chọn câu hỏi mới
    setQuestionList((prevList) => {
      const newList = [...prevList, newQuestion];
      setSelectedIndex(newList.length - 1);
      setQuestionText('');
      setAnswers(newQuestion.answers);
      setTimeLimit('20');
      return newList;
    });
  };

  const handleSelectQuestion = (index: number) => {
    // Lưu câu hỏi hiện tại trước khi chuyển sang câu hỏi khác
    handleSave();

    // Sau đó set dữ liệu câu hỏi được chọn
    const q = questionList[index];
    if (q) {
      setSelectedIndex(index);
      setQuestionText(q.question);
      setAnswers(q.answers);
      setTimeLimit(q.timeLimit.toString());
    }
  };

  const handleDelete = () => {
    setQuestionList((prevList) => {
      const updated = prevList.filter((_, idx) => idx !== selectedIndex);
      // Cập nhật selectedIndex và form dựa trên danh sách mới
      if (updated.length > 0) {
        const newIndex = Math.min(selectedIndex, updated.length - 1);
        const q = updated[newIndex];
        setSelectedIndex(newIndex);
        setQuestionText(q.question);
        setAnswers(q.answers);
        setTimeLimit(q.timeLimit.toString());
      } else {
        // Nếu xóa hết thì reset form
        resetForm();
        setSelectedIndex(0);
      }
      return updated;
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Danh sách câu hỏi */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col shadow-sm">
        <Button
          className="mb-4 bg-red-500 hover:bg-red-600 text-white"
          onClick={() => navigate('/view-quiz')}
        >
          Exit
        </Button>
        <div className="flex-1 overflow-y-auto space-y-2">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white">
        <Textarea
          placeholder="Enter question..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
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
                className="w-5 h-5 accent-green-500 rounded"
                title="Correct answer"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
            Save Question
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete Question
          </Button>
          <Button className=" bg-green-500 hover:bg-green-600 text-white" onClick={handleAddNew}>
            Add Question
          </Button>
        </div>
      </div>

      {/* Sidebar phải */}
      <div className="w-64 bg-white border-l border-gray-200 p-4 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit</label>
          <Select value={timeLimit} onValueChange={setTimeLimit}>
            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="10" className="hover:bg-gray-50">
                10 seconds
              </SelectItem>
              <SelectItem value="20" className="hover:bg-gray-50">
                20 seconds
              </SelectItem>
              <SelectItem value="30" className="hover:bg-gray-50">
                30 seconds
              </SelectItem>
              <SelectItem value="60" className="hover:bg-gray-50">
                60 seconds
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
