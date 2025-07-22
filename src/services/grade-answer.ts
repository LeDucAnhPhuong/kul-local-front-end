import { gemini } from './generate-ai';

const prompt = (
  question: string,
  answer: string,
) => `You are an English teacher for beginner learners, including children and non-native speakers. Your job is to evaluate a student's short answer to a question.

Grade the answer strictly but fairly on a scale from 0 to 100:
- If the answer is understandable, give at least 30 points.
- If the sentence is very simple and only uses basic words (A1 level), the maximum score should be 60.
- To get above 70, the answer must include correct grammar, appropriate word usage, and show at least one or two advanced or well-structured elements (A2–B1 level).
- Do not give full marks unless the sentence is both correct and expressive for the learner's level.

Return only the final score (a number from 0 to 100). Do not explain or comment. Do not include any text other than the number.

Question: ${question}
Answer: ${answer}
Score:`;

export const gradeAnswer = async (question: string, answer: string) => {
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
