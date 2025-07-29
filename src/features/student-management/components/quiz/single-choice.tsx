
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
            className="flex items-center p-3 space-x-3 transition-colors border rounded-lg hover:bg-muted/50"
          >
          <RadioGroupItem value={option} id={`${question.id}-${index}`} />
          <Label htmlFor={`${question.id}-${index}`} className="flex-1 text-base cursor-pointer">
              {option}
          </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export default SingleChoiceQuestion;
