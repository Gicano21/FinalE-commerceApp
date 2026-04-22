import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  createUser,
  authenticateUser,
  getUserById,
  UserData,
} from "../utils/myDatabase";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto login removed - users must manually log in each time

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Authenticate user from database
    const userData = authenticateUser(email, password);
    
    if (!userData) {
      throw new Error("Invalid email or password. Please check your credentials.");
    }

    const newUser = {
      id: userData.id,
      email: userData.email,
      name: userData.username,
    };
    
    setUser(newUser);
    localStorage.setItem("currentUserId", userData.id);
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate password length
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Create user in database
    const userData = await createUser(name, email, password);
    
    if (!userData) {
      throw new Error("An account with this email or username already exists. Please use different credentials or sign in.");
    }

    const newUser = {
      id: userData.id,
      email: userData.email,
      name: userData.username,
    };
    
    setUser(newUser);
    localStorage.setItem("currentUserId", userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUserId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}