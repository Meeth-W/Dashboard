import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/create_account?username=${username}&password=${password}&name=${name}&context=${context}`
        );
        if (!response.data.status) throw new Error(response.data.message);
      } else {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/verify_account?username=${username}&password=${password}`
        );
        if (!response.data.status) throw new Error('Invalid username or password');
      }

      // Store credentials
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('password', password);
      onLogin(username, password);

      // Redirect to home page after login/register
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegistering ? 'Create Account' : 'Login'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          {isRegistering && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Context (e.g., studying CS at XYZ)"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full p-2 rounded bg-gray-700"
                required
              />
            </>
          )}
          <button type="submit" className="w-full p-2 bg-blue-600 hover:bg-blue-500 rounded">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <p
          className="mt-4 text-sm text-center cursor-pointer hover:underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Login;
