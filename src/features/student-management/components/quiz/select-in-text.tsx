import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SelectInTextQuestion({ question, questionIndex, answer, updateAnswer }: any) {
  const content = question.selectContent.content;
  const options = question.selectContent.options;
  const parts = content.split('[]');

  const handleSelectChange = (selectIndex: number, value: string) => {
    const newAnswers = [...(answer?.textAnswers || [])];
    newAnswers[selectIndex] = value;
    updateAnswer(questionIndex, { textAnswers: newAnswers });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold leading-relaxed">{question.questionText}</h3>
      <div className="text-lg leading-relaxed p-4 bg-muted/30 rounded-lg">
        {parts.map((part: string, index: number) => (
          <span key={index}>
            {part}
            {index < options.length && (
              <Select
                onValueChange={(value) => handleSelectChange(index, value)}
                value={answer?.textAnswers?.[index] || ''}
              >
                <SelectTrigger className="inline-flex w-auto min-w-[140px] mx-2">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {options[index].value.map((option: string, optionIndex: number) => (
                    <SelectItem key={optionIndex} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
export default SelectInTextQuestion;