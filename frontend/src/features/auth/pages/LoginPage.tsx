import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Button } from '../../../components/ui';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Authentication failed');

      login(data.token, data.user);
      navigate('/company/hdfc-bank'); // Redirect to dashboard or a company page
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold mb-6">
          {isLogin ? 'Sign in to Nexora' : 'Create an account'}
        </h2>
        
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-1 text-[var(--color-text-secondary)]">Name</label>
              <input
                type="text"
                className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded focus:outline-none focus:border-blue-500"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text-secondary)]">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded focus:outline-none focus:border-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text-secondary)]">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded focus:outline-none focus:border-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full justify-center">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
