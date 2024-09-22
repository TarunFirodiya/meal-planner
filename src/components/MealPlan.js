import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function MealPlan({ user }) {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealPlan();
  }, [user]);

  const fetchMealPlan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching meal plan:', error);
    } else if (data) {
      setMealPlan(data.plan);
    }
    setLoading(false);
  };

  const handleMealEdit = async (day, mealType, newMeal) => {
    const updatedPlan = { ...mealPlan };
    updatedPlan[day][mealType] = newMeal;
    setMealPlan(updatedPlan);

    const { error } = await supabase
      .from('meal_plans')
      .update({ plan: updatedPlan })
      .eq('user_id', user.id)
      .eq('id', mealPlan.id);

    if (error) {
      console.error('Error updating meal plan:', error);
      alert('Failed to update meal plan. Please try again.');
    }
  };

  const handleMealRating = async (day, mealType, rating) => {
    const { error } = await supabase
      .from('meal_ratings')
      .insert({
        user_id: user.id,
        meal_id: mealPlan[day][mealType].id,
        rating: rating
      });

    if (error) {
      console.error('Error saving meal rating:', error);
      alert('Failed to save meal rating. Please try again.');
    } else {
      alert('Rating saved successfully!');
    }
  };

  if (loading) return <div>Loading meal plan...</div>;
  if (!mealPlan) return <div>No meal plan found. Please generate a new one.</div>;

  return (
    <div className="meal-plan">
      <h2>Your Weekly Meal Plan</h2>
      {Object.entries(mealPlan).map(([day, meals]) => (
        <div key={day} className="day-plan">
          <h3>{day}</h3>
          {Object.entries(meals).map(([mealType, meal]) => (
            <div key={mealType} className="meal">
              <h4>{mealType}</h4>
              <p>{meal.name}</p>
              <button onClick={() => handleMealEdit(day, mealType, prompt('Enter new meal:', meal.name))}>
                Edit
              </button>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleMealRating(day, mealType, star)}>
                    {star <= (meal.rating || 0) ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MealPlan;