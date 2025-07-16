import { Input } from '@/components/ui/input';

function FillBlankQuestion({ question, questionIndex, answer, updateAnswer }: any) {
  const content = question?.fillInBlank?.content;
  const blanks = content.split('[]');
  const blankCount = blanks.length - 1;

  const handleInputChange = (blankIndex: number, value: string) => {
    const newAnswers = [...(answer?.textAnswers || [])];
    newAnswers[blankIndex] = value;
    updateAnswer(questionIndex, { textAnswers: newAnswers });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold leading-relaxed">{question?.questionText}</h3>
      <div className="text-lg leading-relaxed p-4 bg-muted/30 rounded-lg">
        {blanks.map((part: string, index: number) => (
          <span key={index}>
            {part}
            {index < blankCount && (
              <Input
                className="inline-block w-40 mx-2 font-medium"
                placeholder={`Blank ${index + 1}`}
                value={answer?.textAnswers?.[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default FillBlankQuestion;
