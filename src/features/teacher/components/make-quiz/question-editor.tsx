import React, { useState, useEffect } from 'react';
import type {
  Question,
  QuestionType,
  Option,
  MatchPair,
  SelectDropdown,
  QuestionDTO,
} from './question.type';
import { Plus, X, AlertCircle } from 'lucide-react';
import { QuestionTypeEnum } from './question.type';
import { useCreateQuestionMutation, useUpdateQuestionMutation } from './api.question';
import { Button } from '@/components/ui/button';

interface QuestionEditorProps {
  type: QuestionType;
  initialQuestion?: Question;
  onCancel: () => void;
  quizId: string;
  editorType?: 'create' | 'update';
}

interface ValidationErrors {
  title?: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string;
  pairs?: string[];
  sentence?: string;
  dropdowns?: string[];
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  type,
  initialQuestion,
  onCancel,
  quizId,
  editorType = 'create',
}) => {
  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const [title, setTitle] = useState(initialQuestion?.title || '');
  const [options, setOptions] = useState<Option[]>(() => {
    if (initialQuestion && 'options' in initialQuestion) {
      return initialQuestion.options;
    }
    return [
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' },
      { id: '4', text: '' },
    ];
  });
  const [correctAnswer, setCorrectAnswer] = useState<number>(() => {
    if (initialQuestion && 'correctAnswer' in initialQuestion) {
      return Number(initialQuestion.correctAnswer);
    }
    return 0;
  });
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(() => {
    if (initialQuestion && 'correctAnswers' in initialQuestion) {
      return initialQuestion.correctAnswers;
    }
    return [];
  });
  const [pairs, setPairs] = useState<MatchPair[]>(() => {
    if (initialQuestion && initialQuestion.type === QuestionTypeEnum.PairKey) {
      return initialQuestion.pairs;
    }
    return [
      { id: '1', left: '', right: '' },
      { id: '2', left: '', right: '' },
      { id: '3', left: '', right: '' },
    ];
  });
  const [sentence, setSentence] = useState(() => {
    if (initialQuestion && 'sentence' in initialQuestion) {
      return initialQuestion.sentence;
    }
    return '';
  });
  const [dropdowns, setDropdowns] = useState<SelectDropdown[]>(() => {
    if (initialQuestion && initialQuestion.type === QuestionTypeEnum.SelectInText) {
      return initialQuestion.dropdowns;
    }
    return [];
  });
  const [fillCorrectAnswer, setFillCorrectAnswer] = useState(() => {
    if (initialQuestion && initialQuestion.type === QuestionTypeEnum.Fillblank) {
      return initialQuestion.correctAnswer;
    }
    return [];
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) {
      newErrors.title = 'This field is required';
    }

    switch (type) {
      case QuestionTypeEnum.SingleChoice:
      case QuestionTypeEnum.MultipleChoice:
        const optionErrors: string[] = [];
        options.forEach((option, index) => {
          if (!option.text.trim()) {
            optionErrors[index] = 'This field is required';
          }
        });
        if (optionErrors.length > 0) {
          newErrors.options = optionErrors;
        }

        if (type === QuestionTypeEnum.MultipleChoice && correctAnswers.length === 0) {
          newErrors.correctAnswers = 'Select at least one correct answer';
        }
        break;

      case QuestionTypeEnum.PairKey:
        const pairErrors: string[] = [];
        pairs.forEach((pair, index) => {
          if (!pair.left.trim() || !pair.right.trim()) {
            pairErrors[index] = 'Both fields are required';
          }
        });
        if (pairErrors.length > 0) {
          newErrors.pairs = pairErrors;
        }
        break;

      case QuestionTypeEnum.SelectInText:
        if (!sentence.trim()) {
          newErrors.sentence = 'This field is required';
        } else {
          console.log('sentence ', sentence.match('[]'));
          const dropdownCount = (sentence.match(/\[\]/g) || []).length;
          if (dropdownCount === 0) {
            newErrors.sentence = 'Sentence must contain at least one "[]" for dropdown placement';
          } else if (dropdownCount !== dropdowns.length) {
            newErrors.sentence = `Sentence has ${dropdownCount} dropdowns but ${dropdowns.length} are configured`;
          }
        }

        const dropdownErrors: string[] = [];
        dropdowns.forEach((dropdown, dropdownIndex) => {
          dropdown.options.forEach((option: string) => {
            if (!option.trim()) {
              if (!dropdownErrors[dropdownIndex]) dropdownErrors[dropdownIndex] = '';
              dropdownErrors[dropdownIndex] = 'All options are required';
            }
          });
        });
        if (dropdownErrors.length > 0) {
          newErrors.dropdowns = dropdownErrors;
        }
        break;

      case QuestionTypeEnum.Fillblank:
        if (!sentence.trim()) {
          newErrors.sentence = 'This field is required';
        } else if (!sentence.includes('[]')) {
          newErrors.sentence = 'Sentence must contain "[]" for the blank placement';
        }

        const matchLength = (sentence.match(/\[\]/g) || []).length;

        if (fillCorrectAnswer.length !== matchLength) {
          newErrors.correctAnswer = 'This field is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const baseQuestion = {
      quizId: quizId,
      questionText: title.trim(),
      isRequired: true,
    };

    let question: QuestionDTO;

    switch (type) {
      case QuestionTypeEnum.SingleChoice:
        question = {
          ...baseQuestion,
          type: QuestionTypeEnum.SingleChoice,
          options: {
            option: options.filter((opt) => opt.text.trim())?.map((opt) => opt.text),
            correctAnswers: [options[correctAnswer].text],
          },
        };
        break;

      case QuestionTypeEnum.MultipleChoice:
        question = {
          ...baseQuestion,
          type: QuestionTypeEnum.MultipleChoice,
          options: {
            option: options.filter((opt) => opt.text.trim())?.map((opt) => opt.text),
            correctAnswers: correctAnswers?.map((index) => options[index].text),
          },
        };
        break;

      case QuestionTypeEnum.PairKey:
        question = {
          ...baseQuestion,
          type: QuestionTypeEnum.PairKey,
          pairs: {
            left: pairs
              .filter((pair) => pair.left.trim() && pair.right.trim())
              ?.map((pair) => pair.left),
            right: pairs
              .filter((pair) => pair.left.trim() && pair.right.trim())
              ?.map((pair) => pair.right),
            correctAnswers: pairs
              ?.filter((pair) => pair.left.trim() && pair.right.trim())
              ?.map((pair) => [pair.left, pair.right]),
          },
        };
        break;

      case QuestionTypeEnum.SelectInText:
        question = {
          ...baseQuestion,
          type: QuestionTypeEnum.SelectInText,
          selectContent: {
            content: sentence.trim(),
            options: dropdowns.map((dropdown) => ({
              value: dropdown.options.filter((opt: string) => opt.trim()),
              correctAnswer: dropdown.options[dropdown.correctAnswer],
            })),
          },
        };
        break;

      case QuestionTypeEnum.Fillblank:
        question = {
          ...baseQuestion,
          type: QuestionTypeEnum.Fillblank,
          fillInBlank: { content: sentence.trim(), correctAnswers: fillCorrectAnswer },
        };
        break;

      default:
        return;
    }
    try {
      if (editorType === 'create') {
        await createQuestion(question).unwrap();
      } else {
        await updateQuestion({ data: question, id: initialQuestion!.id }).unwrap();
      }
      onCancel();
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const addOption = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);

      // Adjust correct answers
      if (type === QuestionTypeEnum.SingleChoice && correctAnswer >= index) {
        setCorrectAnswer(Math.max(0, correctAnswer - 1));
      } else if (type === QuestionTypeEnum.MultipleChoice) {
        const newCorrectAnswers = correctAnswers
          .filter((ans) => ans !== index)
          .map((ans) => (ans > index ? ans - 1 : ans));
        setCorrectAnswers(newCorrectAnswers);
      }
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    setOptions(newOptions);
  };

  console.log('dropdowns', dropdowns);

  const addPair = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setPairs([...pairs, { id: newId, left: '', right: '' }]);
  };

  const removePair = (index: number) => {
    if (pairs.length > 1) {
      setPairs(pairs.filter((_, i) => i !== index));
    }
  };

  const updatePair = (index: number, field: 'left' | 'right', value: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setPairs(newPairs);
  };

  const addDropdown = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setDropdowns([...dropdowns, { id: newId, options: ['', '', ''], correctAnswer: 0 }]);
    // Update sentence to include new dropdown placeholder
    setSentence((prev: any) => prev + ' []');
  };

  const removeDropdown = (dropdownIndex: number) => {
    if (dropdowns.length > 1) {
      setDropdowns(dropdowns.filter((_, i) => i !== dropdownIndex));
      // Remove one [] from sentence
      const parts = sentence.split(/\[\]/g);
      if (parts.length > 1) {
        parts.pop();
        setSentence(parts.join('[]'));
      }
    }
  };

  const addDropdownOption = (dropdownIndex: number) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[dropdownIndex].options.push('');
    setDropdowns(newDropdowns);
  };

  const removeDropdownOption = (dropdownIndex: number, optionIndex: number) => {
    const newDropdowns = [...dropdowns];
    if (newDropdowns[dropdownIndex].options.length > 2) {
      newDropdowns[dropdownIndex].options = newDropdowns[dropdownIndex].options.filter(
        (_: any, i: number) => i !== optionIndex,
      );
      if (newDropdowns[dropdownIndex].correctAnswer >= optionIndex) {
        newDropdowns[dropdownIndex].correctAnswer = Math.max(
          0,
          newDropdowns[dropdownIndex].correctAnswer - 1,
        );
      }
      setDropdowns(newDropdowns);
    }
  };

  const updateDropdownOption = (dropdownIndex: number, optionIndex: number, value: string) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[dropdownIndex].options[optionIndex] = value;
    setDropdowns(newDropdowns);
  };

  const updateDropdownCorrectAnswer = (dropdownIndex: number, correctAnswer: number) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[dropdownIndex].correctAnswer = correctAnswer;
    setDropdowns(newDropdowns);
  };

  const toggleCorrectAnswer = (index: number) => {
    if (correctAnswers.includes(index)) {
      setCorrectAnswers(correctAnswers.filter((ans) => ans !== index));
    } else {
      setCorrectAnswers([...correctAnswers, index]);
    }
  };

  console.log('first', sentence?.match(/\[\]/g)?.length);

  useEffect(() => {
    if (sentence?.match(/\[\]/g)?.length && sentence?.match(/\[\]/g)?.length !== dropdowns.length) {
      const newId = Math.random().toString(36).substr(2, 9);
      setDropdowns([...dropdowns, { id: newId, options: ['', '', ''], correctAnswer: 0 }]);
    }
  }, [sentence?.match(/\[\]/g)?.length]);

  const typeLabels = {
    [QuestionTypeEnum.SingleChoice]: 'Single Choice',
    [QuestionTypeEnum.MultipleChoice]: 'Multiple Choice',
    [QuestionTypeEnum.PairKey]: 'Match Pair',
    [QuestionTypeEnum.SelectInText]: 'Select Answer',
    [QuestionTypeEnum.Fillblank]: 'Fill in the Blank',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {initialQuestion ? 'Edit' : 'Create'} {typeLabels[type]} Question
        </h3>
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      <div className="space-y-6">
        {/* Question Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your question here..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <div className="flex items-center mt-2 text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">{errors.title}</span>
            </div>
          )}
        </div>

        {(type === QuestionTypeEnum.SingleChoice || type === QuestionTypeEnum.MultipleChoice) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options *</label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-3">
                  {type === QuestionTypeEnum.SingleChoice ? (
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={correctAnswers.includes(index)}
                      onChange={() => toggleCorrectAnswer(index)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                  )}
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.options?.[index] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.options && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">All options are required</span>
              </div>
            )}

            {errors.correctAnswers && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.correctAnswers}</span>
              </div>
            )}

            <button
              onClick={addOption}
              className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Option</span>
            </button>
          </div>
        )}

        {type === QuestionTypeEnum.PairKey && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Match Pairs *</label>
            <div className="space-y-3">
              {pairs.map((pair, index) => (
                <div key={pair.id} className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <input
                      type="text"
                      value={pair.left}
                      onChange={(e) => updatePair(index, 'left', e.target.value)}
                      placeholder="Term"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.pairs?.[index] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={pair.right}
                      onChange={(e) => updatePair(index, 'right', e.target.value)}
                      placeholder="Match"
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.pairs?.[index] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {pairs.length > 1 && (
                      <button
                        onClick={() => removePair(index)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {errors.pairs && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Both term and match are required for each pair</span>
              </div>
            )}

            <button
              onClick={addPair}
              className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Pair</span>
            </button>
          </div>
        )}

        {type === QuestionTypeEnum.SelectInText && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sentence with Dropdowns *
              </label>
              <div className="mb-2">
                <p className="text-xs text-gray-500">
                  Use "[]" to mark where dropdowns should appear. Each "[]" will create a dropdown.
                </p>
              </div>
              <input
                type="text"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Enter sentence with [] where dropdowns should appear"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.sentence ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.sentence && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.sentence}</span>
                </div>
              )}
            </div>

            {/* Preview */}
            {sentence && sentence.includes('[]') && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <div className="text-sm text-gray-700">
                  {sentence.split(/\[\]/g).map((part: string, index: number) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < dropdowns.length && (
                        <select className="mx-1 px-2 py-1 border border-blue-500 bg-blue-50 rounded text-blue-700 text-xs">
                          <option>
                            {dropdowns[index]?.options[dropdowns[index]?.correctAnswer] ||
                              'Select...'}
                          </option>
                        </select>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {dropdowns.map((dropdown, dropdownIndex) => (
                <div key={dropdown.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Dropdown {dropdownIndex + 1} Options *
                    </label>
                    {dropdowns.length > 1 && (
                      <button
                        onClick={() => removeDropdown(dropdownIndex)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove dropdown"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {dropdown.options.map((option: string, optionIndex: number) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-dropdown-${dropdownIndex}`}
                          checked={dropdown.correctAnswer === optionIndex}
                          onChange={() => updateDropdownCorrectAnswer(dropdownIndex, optionIndex)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateDropdownOption(dropdownIndex, optionIndex, e.target.value)
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.dropdowns?.[dropdownIndex] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {dropdown.options.length > 2 && (
                          <button
                            onClick={() => removeDropdownOption(dropdownIndex, optionIndex)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {errors.dropdowns?.[dropdownIndex] && (
                    <div className="flex items-center mt-2 text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">{errors.dropdowns[dropdownIndex]}</span>
                    </div>
                  )}

                  <button
                    onClick={() => addDropdownOption(dropdownIndex)}
                    className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Option</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addDropdown}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Another Dropdown</span>
            </button>
          </div>
        )}

        {type === QuestionTypeEnum.Fillblank && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sentence with Blank *
              </label>
              <input
                type="text"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder="Enter sentence with [] where the blank should appear"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.sentence ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.sentence && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.sentence}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
              </label>
              <div className="flex flex-col gap-2">
                {sentence?.match(/\[\]/g)?.map((_, idx) => (
                  <input
                    type="text"
                    value={fillCorrectAnswer?.at(idx)}
                    onChange={(e) =>
                      setFillCorrectAnswer((prev) => [
                        ...prev.slice(0, idx),
                        e.target.value,
                        ...prev.slice(idx + 1),
                      ])
                    }
                    placeholder="Enter the correct answer for the blank"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.correctAnswer ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              {errors.correctAnswer && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.correctAnswer}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            isLoading={isLoading || isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              type === QuestionTypeEnum.MultipleChoice || type === QuestionTypeEnum.Fillblank
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            isLoading={isLoading || isUpdating}
          >
            {initialQuestion ? 'Update Question' : 'Save Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};
