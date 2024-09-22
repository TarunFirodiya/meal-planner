import React from 'react';
import { supabase } from '../supabaseClient';

function MealPlan({ user, mealPlan, setMealPlan }) {
  const handleRating = async (mealIndex, rating) => {
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan.plan[mealIndex].rating = rating;

    const { data, error } = await supabase
      .from('meal_plans')
      .update({ plan: updatedMealPlan.plan })
      .eq('id', mealPlan.id);

    if (error) {
      console.error('Error updating meal rating:', error);
    } else {
      setMealPlan(updatedMealPlan);
    }
  };

  return (
    <div>
      <h2>Your Meal Plan</h2>
      {mealPlan.plan.map((meal, index) => (
        <div key={index}>
          <h3>{meal.name}</h3>
          <p>Ingredients: {meal.ingredients.join(', ')}</p>
          <p>Instructions: {meal.instructions}</p>
          <div>
            Rate this meal:
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(index, star)}
                style={{ color: meal.rating >= star ? 'gold' : 'gray' }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MealPlan;