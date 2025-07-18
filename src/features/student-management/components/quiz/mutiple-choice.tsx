import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

function MultipleChoiceQuestion({ question, questionIndex, answer, updateAnswer }: any) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const handleCheckboxChange = (option: string, checked: boolean, index: number) => {
    const currentOptions = answer.selectedOptions || [];
    if (checked) {
      updateAnswer(questionIndex, { selectedOptions: [...currentOptions, option] });
      setSelectedOptions((prev) => [...prev, index]);
    } else {
      updateAnswer(questionIndex, {
        selectedOptions: currentOptions.filter((o: string) => o !== option),
      });
      setSelectedOptions((prev) => prev.filter((i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold leading-relaxed">{question.questionText}</h3>
      <div className="space-y-3">
        {question.options.option.map((option: string, index: number) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              id={`${question.id}-${index}`}
              checked={selectedOptions?.includes(index) || false}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean, index)}
            />
            <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer text-base">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultipleChoiceQuestion;
