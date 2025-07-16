import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { AssignmentSubmission } from '../../types/assignment';
import { SubmissionContentCard } from './submissionContentCard';
import { mockSubmissions } from '@/features/teacher/data.assign';
import { useNavigate } from 'react-router-dom';

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<AssignmentSubmission | null>(null);

  // State quản lý form điểm và phản hồi
  const [score, setScore] = useState<number | undefined>(undefined);
  const [feedback, setFeedback] = useState<string>('');
  const navigate = useNavigate();
  // Lấy dữ liệu bài nộp theo id khi trang load hoặc id thay đổi
  useEffect(() => {
    if (!id) return;

    const submission = mockSubmissions.find((s) => s.id === id);
    if (submission) {
      setData(submission);
      setScore(submission.score ?? undefined);
      setFeedback(submission.feedback ?? '');
    } else {
      setData(null);
      setScore(undefined);
      setFeedback('');
    }
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="w-auto mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-red-600  px-8 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white tracking-wide">ID: {data.id}</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Video/Content Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6 !w-full">
          <SubmissionContentCard content={data.assignment.type} />
        </div>

        {/* Grading Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Grades & Feedback</h3>
          </div>

          {/* Score Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Score
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className={`w-24 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
                    score !== undefined && score >= 8
                      ? 'border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20'
                      : score !== undefined && score >= 6
                      ? 'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-red-500 text-red-700 bg-red-50 dark:bg-red-900/20'
                  } dark:border-opacity-50`}
                  value={score ?? ''}
                  onChange={(e) =>
                    setScore(e.target.value === '' ? undefined : Number(e.target.value))
                  }
                />
              </div>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={score ?? 0}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #4f46e5 ${
                      (score ?? 0 / 10) * 100
                    }%, #e5e7eb ${(score ?? 0 / 10) * 100}%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Feedback
            </label>
            <textarea
              className="w-full h-32 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
            >
              Save & Submit
            </button>
            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
              onClick={() => navigate('/assignment')}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
