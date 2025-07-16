import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function SingleChoiceQuestion({ question, questionIndex, answer, updateAnswer }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold leading-relaxed">{question.questionText}</h3>
      <RadioGroup
        value={answer?.selectedOption ?? ""}
        onValueChange={(value) => updateAnswer(questionIndex, { selectedOption: value })}
        className="space-y-3"
      >
        {question.options.option.map((option: string, index: number) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <RadioGroupItem value={option} id={`${question.id}-${index}`} />
            <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer text-base">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export default SingleChoiceQuestion;
