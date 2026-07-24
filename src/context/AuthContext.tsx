import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  verifyAdminPassword: (password: string) => boolean;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('wz_admin_session') === 'true';
  });

  const verifyAdminPassword = (password: string): boolean => {
    // Required password: Rokokza223@
    if (password === 'Rokokza223@') {
      setIsAdmin(true);
      localStorage.setItem('wz_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('wz_admin_session');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, verifyAdminPassword, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
