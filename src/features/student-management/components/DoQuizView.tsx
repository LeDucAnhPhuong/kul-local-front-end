import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Types
export type QuizData = {
  _id: number;
  title: string;
  date: string;
  isActive: boolean;
  status: 'Done' | 'Not started' | 'Can not be started';
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  questions: QuestionData[];
};

export type QuestionData = {
  _id: number;
  quiz_id: number;
  content: string;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  options: string[];
  timeLimit: number;
  points: number;
};

// Sample data
let quizSampleData: QuizData[] = [
  {
    _id: 1,
    title: 'Academic Text Comprehension',
    date: '2025-06-10',
    isActive: true,
    status: 'Can not be started',
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-20T08:00:00Z',
    updated_at: '2025-05-25T10:30:00Z',
    questions: [
      {
        _id: 1,
        quiz_id: 1,
        content: 'Which of the following is NOT a typical feature of academic texts?',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:15:00Z',
        updated_at: '2025-05-20T08:15:00Z',
        options: [
          'Formal vocabulary and complex sentence structures',
          'Objective tone and evidence-based arguments',
          'Emotional language and personal opinions',
          'Citations and references to other sources'
        ],
        timeLimit: 30,
        points: 10
      },
      {
        _id: 2,
        quiz_id: 1,
        content: 'Complete the sentence: "The research _____ that climate change is accelerating faster than previously predicted."',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:20:00Z',
        updated_at: '2025-05-20T08:20:00Z',
        options: ['suggests', 'proves', 'denies', 'ignores'],
        timeLimit: 20,
        points: 15
      },
      {
        _id: 3,
        quiz_id: 1,
        content: 'Skimming and scanning are both effective reading strategies for IELTS Reading tasks.',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:25:00Z',
        updated_at: '2025-05-20T08:25:00Z',
        options: ['true', 'false'],
        timeLimit: 10,
        points: 5
      },
        {
        _id: 4,
        quiz_id: 2,
        content: 'What is the minimum word count requirement for IELTS Writing Task 1?',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:15:00Z',
        updated_at: '2025-05-22T09:15:00Z',
        options: ['120 words', '150 words', '200 words', '250 words'],
        timeLimit: 20,
        points: 10
      },
      {
        _id: 5,
        quiz_id: 2,
        content: 'Fill in the blank: "The graph shows a _____ increase in unemployment rates from 2020 to 2021."',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:20:00Z',
        updated_at: '2025-05-22T09:20:00Z',
        options: ['significant', 'slight', 'dramatic', 'steady'],
        timeLimit: 25,
        points: 15
      },
      {
        _id: 6,
        quiz_id: 2,
        content: 'In IELTS Writing Task 1, you should give your personal opinion about the data presented.',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:25:00Z',
        updated_at: '2025-05-22T09:25:00Z',
        options: ['true', 'false'],
        timeLimit: 15,
        points: 5
      }
    ]
  },
  
];

export default function QuizInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quizId = Number(id);
  const currentQuiz = quizSampleData.find((quiz) => quiz._id === quizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (currentQuiz) {
      setTimeLeft(currentQuiz.questions[0].timeLimit);
      setStartTime(new Date());
    }
  }, [currentQuiz]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isSubmitted]);

  if (!currentQuiz) return <div>Quiz not found</div>;
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const totalQuestions = currentQuiz.questions.length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  const handleSubmit = () => {
    setEndTime(new Date());
    setIsSubmitted(true);

    // Simulate updating quiz status (later replaced by API call)
    const quizIndex = quizSampleData.findIndex((quiz) => quiz._id === quizId);
    if (quizIndex !== -1) {
      quizSampleData[quizIndex].status = 'Done';
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(answers[nextIndex] || '');
      setTimeLeft(currentQuiz.questions[nextIndex].timeLimit);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedAnswer(answers[prevIndex] || '');
      setTimeLeft(currentQuiz.questions[prevIndex].timeLimit);
    }
  };

  const calculateResults = () => {
    return 5; // Replace with actual grading logic
  };

  if (isSubmitted) {
    const correctAnswers = calculateResults();
    const   totalTime = endTime && startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="w-full max-w-2xl p-8 bg-white shadow-2xl rounded-2xl">
          <div className="mb-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Quiz Completed!</h1>
            <p className="text-gray-600">Here are your results</p>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Results Summary</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-800">Total Questions</span>
                    <span className="text-2xl font-bold text-blue-600">{totalQuestions}</span>
                  </div>
                </div>
                <div className="p-4 bg-green-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">Correct Answers</span>
                    <span className="text-2xl font-bold text-green-600">{correctAnswers}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 mt-4 bg-purple-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-800">Score</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {Math.round((correctAnswers / totalQuestions) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Time Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-medium text-gray-800">{startTime ? formatDateTime(startTime) : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">End Time:</span>
                  <span className="font-medium text-gray-800">{endTime ? formatDateTime(endTime) : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-gray-600">Total Duration:</span>
                  <span className="font-medium text-gray-800">{formatTime(totalTime)}</span>
                </div>
              </div>
            </div>
            <Button variant="secondary"  onClick={() => navigate('/quizzes-student')}>Back to quizzes list</Button>
            <button onClick={() => window.location.reload()} className="w-full py-3 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600">
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <button className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
            Theory Test Section
          </button>
        </div>
      </div>

      <div className="p-4 mb-8 text-center text-white bg-green-500 rounded-lg">
        <h2 className="text-lg font-medium">
          {currentQuestionIndex + 1}. {currentQuestion.content}
        </h2>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - timeLeft / currentQuestion.timeLimit)}`}
              className="text-green-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-1 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                selectedAnswer === option
                  ? 'bg-green-500 text-white transform scale-105 shadow-xl'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } hover:transform hover:scale-105 shadow-md`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed flex gap-4 transform -translate-x-1/2 bottom-8 left-1/2">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
