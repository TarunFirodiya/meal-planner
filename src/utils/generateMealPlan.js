import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

async function generateMealPlan(preferences) {
  const prompt = `Generate a 7-day meal plan based on the following preferences:
    Dietary Restrictions: ${preferences.dietary_restrictions}
    Allergies: ${preferences.allergies}
    Cuisine Preferences: ${preferences.cuisine_preferences}
    Cooking Skill: ${preferences.cooking_skill}
    Meal Prep Time: ${preferences.meal_prep_time} minutes

    For each meal, provide:
    1. Meal name
    2. List of ingredients
    3. Brief cooking instructions

    Format the response as a JSON array of meal objects.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const mealPlan = JSON.parse(response.choices[0].message.content);
    return mealPlan;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
}

export default generateMealPlan;