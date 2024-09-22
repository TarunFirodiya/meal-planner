import React, { useState, useEffect } from 'react';

function PreferencesForm({ user, preferences, onSubmit }) {
  const [formData, setFormData] = useState({
    dietary_restrictions: '',
    allergies: '',
    cuisine_preferences: '',
    cooking_skill: 'beginner',
    meal_prep_time: '30',
  });

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Meal Preferences</h2>
      <div>
        <label htmlFor="dietary_restrictions">Dietary Restrictions:</label>
        <input
          type="text"
          id="dietary_restrictions"
          name="dietary_restrictions"
          value={formData.dietary_restrictions}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="allergies">Allergies:</label>
        <input
          type="text"
          id="allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="cuisine_preferences">Cuisine Preferences:</label>
        <input
          type="text"
          id="cuisine_preferences"
          name="cuisine_preferences"
          value={formData.cuisine_preferences}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="cooking_skill">Cooking Skill:</label>
        <select
          id="cooking_skill"
          name="cooking_skill"
          value={formData.cooking_skill}
          onChange={handleChange}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div>
        <label htmlFor="meal_prep_time">Meal Prep Time (minutes):</label>
        <input
          type="number"
          id="meal_prep_time"
          name="meal_prep_time"
          value={formData.meal_prep_time}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save Preferences</button>
    </form>
  );
}

export default PreferencesForm;