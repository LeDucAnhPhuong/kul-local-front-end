'use client';
import { useDeleteQuestionMutation } from './api.question';
import React, { useState } from 'react';
import { QuestionTypeEnum, type Question } from './question.type';
import { DeleteConfirmModal } from './delete-comfirm-modal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit2,
  Trash2,
  CircleDot,
  CheckSquare,
  ArrowLeftRight,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
}

const typeIcons = {
  [QuestionTypeEnum.SingleChoice]: CircleDot,
  [QuestionTypeEnum.MultipleChoice]: CheckSquare,
  [QuestionTypeEnum.PairKey]: ArrowLeftRight,
  [QuestionTypeEnum.SelectInText]: ChevronDown,
  [QuestionTypeEnum.Fillblank]: Edit3,
};

const typeLabels = {
  [QuestionTypeEnum.SingleChoice]: 'Single Choice',
  [QuestionTypeEnum.MultipleChoice]: 'Multiple Choice',
  [QuestionTypeEnum.PairKey]: 'Match Pair',
  [QuestionTypeEnum.SelectInText]: 'Select Answer',
  [QuestionTypeEnum.Fillblank]: 'Fill in the Blank',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();
  const IconComponent = typeIcons[question.type];

  const handleDelete = async () => {
    try {
      await deleteQuestion(question.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const renderQuestionPreview = () => {
    switch (question.type) {
      case QuestionTypeEnum.SingleChoice:
        return (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <div key={option.id} className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    idx === question.correctAnswer
                      ? 'border-green-500 bg-green-100'
                      : 'border-muted-foreground/30'
                  }`}
                >
                  {idx === question.correctAnswer && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{option.text}</span>
              </div>
            ))}
          </div>
        );

      case QuestionTypeEnum.MultipleChoice:
        return (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <div key={option.id} className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    question.correctAnswers.includes(idx)
                      ? 'border-green-500 bg-green-100'
                      : 'border-muted-foreground/30'
                  }`}
                >
                  {question.correctAnswers.includes(idx) && (
                    <div className="w-2 h-2 bg-green-500 rounded-sm" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{option.text}</span>
              </div>
            ))}
          </div>
        );

      case QuestionTypeEnum.PairKey:
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Terms
              </h4>
              {question.pairs.map((pair) => (
                <Card key={pair.id} className="p-3">
                  <span className="text-sm">{pair.left}</span>
                </Card>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Matches
              </h4>
              {question.pairs.map((pair) => (
                <Card key={pair.id} className="p-3">
                  <span className="text-sm">{pair.right}</span>
                </Card>
              ))}
            </div>
          </div>
        );

      case QuestionTypeEnum.SelectInText:
        const parts = question.sentence.split(/\[\]/g);
        return (
          <div className="text-sm">
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < question.dropdowns.length && (
                  <Select
                    value={
                      question.dropdowns[index].options[question.dropdowns[index].correctAnswer]
                    }
                  >
                    <SelectTrigger className="inline-flex w-auto h-auto px-2 py-1 mx-1 border-green-500 bg-green-50 text-green-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {question?.dropdowns?.[index]?.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </React.Fragment>
            ))}
          </div>
        );

      case QuestionTypeEnum.Fillblank:
        const blankParts = question.sentence.split(/\[\]/g);
        return (
          <div className="text-sm">
            {blankParts?.slice(0, blankParts?.length - 1)?.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                <span className="mx-1 px-2 py-1 bg-green-50 border-b-2 border-green-500 text-green-700 italic">
                  {question.correctAnswer?.at(index)}
                </span>
              </React.Fragment>
            ))}
            {blankParts?.length > 0 && <span> {blankParts[blankParts.length - 1]}</span>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {index}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[question.type]}
                  </Badge>
                </div>
                <h3 className="font-medium text-foreground">{question.title}</h3>
              </div>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(question)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                title="Edit question"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                title="Delete question"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">{renderQuestionPreview()}</CardContent>
      </Card>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        questionTitle={question.title}
      />
    </>
  );
};
