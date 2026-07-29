import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 1. Try checking backend JWT cookie endpoint
        const response = await fetch('http://localhost:3001/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            setIsLoggedIn(true);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.info("Backend API offline or unreachable, falling back to local session state.");
      }

      // 2. Check local storage session fallback
      const cachedUser = localStorage.getItem('codebattle_authenticated_user');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (e) {
          localStorage.removeItem('codebattle_authenticated_user');
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Quick Guest Login
  const loginAsGuest = (usernameInput) => {
    const guestUser = {
      username: usernameInput || 'GHOST_OPERATOR',
      email: `${(usernameInput || 'ghost').toLowerCase()}@codebattle.io`,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GhostCoder',
      authProvider: 'guest',
      stats: {
        level: 1,
        exp: 250,
        bp: 1000,
        roomCredits: 1
      }
    };

    localStorage.setItem('codebattle_authenticated_user', JSON.stringify(guestUser));
    setUser(guestUser);
    setIsLoggedIn(true);
  };

  // Google OAuth Login Trigger
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  // GitHub OAuth Login Trigger
  const loginWithGithub = () => {
    window.location.href = 'http://localhost:3001/api/auth/github';
  };

  // Logout Trigger
  const logout = async () => {
    try {
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.info("Backend logout notification dispatched.");
    }
    localStorage.removeItem('codebattle_authenticated_user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        loginAsGuest,
        loginWithGoogle,
        loginWithGithub,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
