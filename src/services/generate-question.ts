import { gemini } from './generate-ai';

const prompt = `Generate one random English conversation question suitable for A2–B1 learners. The question should be slightly more challenging than beginner-level. It can ask about opinions, preferences, past experiences, or simple explanations. Keep the vocabulary and grammar clear and accessible.

Return only the question string. Do not include any numbering, formatting, or extra text.`;

export const generateQuestion = async () => {
  try {
    const response = await gemini.post('/gemini-2.0-flash:generateContent', {
      contents: [
        {
          parts: [
            {
              text: prompt,
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
