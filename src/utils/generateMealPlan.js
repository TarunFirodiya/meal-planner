import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // This allows usage in the browser
});

async function generateMealPlan(preferences) {
  const { dietType, allergies, healthGoals, calorieTarget } = preferences;

  const prompt = `Generate a 7-day meal plan for a person with the following preferences:
  Diet Type: ${dietType}
  Allergies: ${allergies.join(', ')}
  Health Goals: ${healthGoals}
  Daily Calorie Target: ${calorieTarget}

  For each day, provide:
  1. Breakfast
  2. Lunch
  3. Dinner
  4. Snack

  Format the response as a JSON object with the following structure:
  {
    "day1": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    "day2": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" },
    ...
    "day7": { "breakfast": "", "lunch": "", "dinner": "", "snack": "" }
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a nutritionist and meal planning expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const mealPlan = JSON.parse(response.choices[0].message.content);
    return mealPlan;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
}

export default generateMealPlan;