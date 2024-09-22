import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import PreferencesForm from './components/PreferencesForm';
import MealPlan from './components/MealPlan';
import generateMealPlan from './utils/generateMealPlan';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    // Check for authenticated user
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        await fetchUserPreferences(session.user);
        await fetchMealPlan(session.user);
      }
    };

    fetchSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setLoading(false);
        if (currentUser) {
          await fetchUserPreferences(currentUser);
          await fetchMealPlan(currentUser);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserPreferences = async (currentUser) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
    } else {
      setPreferences(data);
    }
  };

  const fetchMealPlan = async (currentUser) => {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching meal plan:', error);
    } else {
      setMealPlan(data);
    }
  };

  const handlePreferencesSubmit = async (newPreferences) => {
    setLoading(true);
    try {
      // Update preferences in the database
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ user_id: user.id, ...newPreferences });

      if (error) throw error;

      setPreferences(data);

      // Generate new meal plan
      const newMealPlan = await generateMealPlan(newPreferences);

      // Save new meal plan to the database
      const { data: mealPlanData, error: mealPlanError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          plan: newMealPlan,
          week_start_date: new Date().toISOString().split('T')[0], // Current date
        });

      if (mealPlanError) throw mealPlanError;

      setMealPlan(mealPlanData[0]);
    } catch (error) {
      console.error('Error updating preferences or generating meal plan:', error);
      alert('Failed to update preferences or generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>Meal Planner</h1>
      {!user ? (
        <Auth supabase={supabase} setUser={setUser} />
      ) : (
        <div>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
          <PreferencesForm
            user={user}
            preferences={preferences}
            onSubmit={handlePreferencesSubmit}
          />
          {mealPlan ? (
            <MealPlan user={user} mealPlan={mealPlan} setMealPlan={setMealPlan} />
          ) : (
            <p>No meal plan generated yet. Please submit your preferences to get started.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;