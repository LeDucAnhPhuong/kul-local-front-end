import { gemini } from './generate-ai';

const prompt = (
  question: string,
  answer: string,
): string => `You are an English spelling corrector. Your job is to correct only words in a sentence that are misspelled but sound similar to the correct word (homophones or phonetically similar). Do not correct grammar, vocabulary, or sentence structure. Do not rewrite words that are spelled correctly but used incorrectly in context.

Use the question below to understand the context, but only fix phonetically incorrect words.

Return only the corrected Answer — do not include the question, explanation, or any extra text.

Question: ${question}
Answer: ${answer}
Corrected Answer:
`;
export const makeAnswerMoreCorrectfully = async (question: string, answer: string) => {
  try {
    const response = await gemini.post('/gemini-2.0-flash:generateContent', {
      contents: [
        {
          parts: [
            {
              text: prompt(question, answer),
            },
          ],
        },
      ],
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error checking news:', error);
  }
};
