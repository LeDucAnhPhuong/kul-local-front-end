import React, { useState } from 'react';
import type { Question, QuestionTypeInfo } from './question.type';
import { QuestionCard } from './question-card';
import { QuestionEditor } from './question-editor';
import { Package, MousePointer } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExcelUploadQuestionModal from './import-question';
import { useExportQuestionsMutation } from './api.question';

interface QuestionCanvasProps {
  questions: Question[];
}

export const QuestionCanvas: React.FC<QuestionCanvasProps> = ({ questions }) => {
  const { quizId } = useParams<{ quizId: string }>();

  const [isDragOver, setIsDragOver] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [creatingType, setCreatingType] = useState<QuestionTypeInfo | null>(null);
  const [exportQuestion, { isLoading: isExporting }] = useExportQuestionsMutation();

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const questionTypeData = e.dataTransfer.getData('application/json');
    if (questionTypeData) {
      const questionType: QuestionTypeInfo = JSON.parse(questionTypeData);
      setCreatingType(questionType);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleCancelCreate = () => {
    setCreatingType(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const handleExportQuestion = async () => {
    try {
      const res = await exportQuestion(quizId).unwrap();
      const blobUrl = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Question_${new Date().toISOString()}.xlsx`; // 👈 Tên file tải về
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {}
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 justify-between">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Question</h1>
            <p className="text-gray-600">Create and manage your quiz questions with drag & drop</p>
          </div>
          <div className="flex gap-4">
            <ExcelUploadQuestionModal quizId={quizId} />
            <Button variant="outline" onClick={handleExportQuestion} isLoading={isExporting}>
              Export Questions
            </Button>
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-96 border-2 border-dashed rounded-xl transition-all duration-200 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : questions.length === 0 && !creatingType && !editingQuestion
              ? 'border-gray-300 bg-white'
              : 'border-transparent bg-transparent'
          }`}
        >
          {questions.length === 0 && !creatingType && !editingQuestion && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                {isDragOver ? (
                  <MousePointer
                    className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDragOver ? 'text-blue-900' : 'text-gray-900'
                }`}
              >
                {isDragOver ? 'Drop here to create question' : 'Drag a question type here to start'}
              </h3>
              <p className={`text-sm ${isDragOver ? 'text-blue-700' : 'text-gray-500'}`}>
                {isDragOver
                  ? 'Release to add this question type to your quiz'
                  : 'Select a question type from the panel and drag it to this area'}
              </p>
            </div>
          )}

          {creatingType && (
            <div className="mb-6">
              <QuestionEditor
                type={creatingType.type}
                onCancel={handleCancelCreate}
                quizId={quizId!}
                editorType="create"
              />
            </div>
          )}

          {/* Question Editing Form */}
          {editingQuestion && (
            <div className="mb-6">
              <QuestionEditor
                type={editingQuestion.type}
                initialQuestion={editingQuestion}
                onCancel={handleCancelEdit}
                quizId={quizId!}
                editorType="update"
              />
            </div>
          )}

          {/* Questions List */}
          {questions.length > 0 && !editingQuestion && (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index + 1}
                  onEdit={handleEditQuestion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
