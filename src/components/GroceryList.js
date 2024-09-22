import React from 'react';

function GroceryList({ mealPlan }) {
  const groceryList = mealPlan.plan.reduce((acc, meal) => {
    meal.ingredients.forEach(ingredient => {
      if (!acc.includes(ingredient)) {
        acc.push(ingredient);
      }
    });
    return acc;
  }, []);

  return (
    <div>
      <h2>Grocery List</h2>
      <ul>
        {groceryList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default GroceryList;
