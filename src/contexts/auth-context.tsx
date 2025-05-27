import { useEffect, useMemo, useState } from 'react';

import { AuthContext, type User } from './auth-context-types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token');
    if (token === null || token === '') {
      setIsLoading(false);
      return;
    }

    // Simulate user data fetch
    const storedUser = localStorage.getItem('user');
    if (storedUser !== null && storedUser !== '') {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> =>
    // Simulate API call
    new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          const newUser: User = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('token', 'dummy-token');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
