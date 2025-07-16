import React from 'react';
import { QuestionTypeEnum, type QuestionTypeInfo } from './question.type';
import { CircleDot, CheckSquare, ArrowLeftRight, ChevronDown, Edit3, Grip } from 'lucide-react';

const questionTypes: QuestionTypeInfo[] = [
  {
    type: QuestionTypeEnum.SingleChoice,
    label: 'Single Choice',
    description: 'Select one correct answer',
    icon: 'CircleDot',
  },
  {
    type: QuestionTypeEnum.MultipleChoice,
    label: 'Multiple Choice',
    description: 'Select multiple correct answers',
    icon: 'CheckSquare',
  },
  {
    type: QuestionTypeEnum.PairKey,
    label: 'Match Pair',
    description: 'Match terms with definitions',
    icon: 'ArrowLeftRight',
  },
  {
    type: QuestionTypeEnum.SelectInText,
    label: 'Select Answer',
    description: 'Choose from dropdown options',
    icon: 'ChevronDown',
  },
  {
    type: QuestionTypeEnum.Fillblank,
    label: 'Fill in the Blank',
    description: 'Complete the sentence',
    icon: 'Edit3',
  },
];

const iconMap = {
  CircleDot,
  CheckSquare,
  ArrowLeftRight,
  ChevronDown,
  Edit3,
};

interface QuestionTypePanelProps {
  onDragStart: (type: QuestionTypeInfo) => void;
}

export const QuestionTypePanel: React.FC<QuestionTypePanelProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, questionType: QuestionTypeInfo) => {
    e.dataTransfer.setData('application/json', JSON.stringify(questionType));
    onDragStart(questionType);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Question Types</h2>
        <p className="text-sm text-gray-600">Drag a question type to the canvas to get started</p>
      </div>

      <div className="space-y-3">
        {questionTypes.map((type) => {
          const IconComponent = iconMap[type.icon as keyof typeof iconMap];

          return (
            <div
              key={type.type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 cursor-move transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Grip className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white group-hover:bg-blue-100 border border-gray-200 group-hover:border-blue-300 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                    {type.label}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-blue-700 mt-1">
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
