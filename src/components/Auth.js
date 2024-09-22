import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Auth({ setUser }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      alert(error.message);
    } else {
      setUser(user);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin}>
        <h2>Login or Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <button onClick={handleSignUp} disabled={loading}>
        {loading ? 'Loading...' : 'Sign Up'}
      </button>
    </div>
  );
}

export default Auth;