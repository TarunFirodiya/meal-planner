import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function PreferencesForm({ user, onSubmit }) {
  const [preferences, setPreferences] = useState({
    dietType: '',
    allergies: [],
    healthGoals: '',
    calorieTarget: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing preferences when component mounts
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching preferences:', error);
    } else if (data) {
      setPreferences(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(preferences);
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dietary Preferences & Health Goals</h2>
      
      <label>
        Diet Type:
        <select name="dietType" value={preferences.dietType} onChange={handleChange}>
          <option value="">Select a diet</option>
          <option value="omnivore">Omnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>
      </label>

      <label>
        Allergies (comma-separated):
        <input
          type="text"
          name="allergies"
          value={preferences.allergies.join(',')}
          onChange={(e) => setPreferences(prev => ({ ...prev, allergies: e.target.value.split(',').map(item => item.trim()) }))}
        />
      </label>

      <label>
        Health Goals:
        <textarea name="healthGoals" value={preferences.healthGoals} onChange={handleChange} />
      </label>

      <label>
        Daily Calorie Target:
        <input type="number" name="calorieTarget" value={preferences.calorieTarget} onChange={handleChange} />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
}

export default PreferencesForm;