/* eslint-disable react-refresh/only-export-components */
import React from "react";
import type {
  AuthContextType,
  User,
  LoginRequest,
  RegisterRequest,
  UpdateUserData,
  GoogleLoginRequest,
} from "../utils/types";
import { authService } from "../services/authService";

interface AuthProviderProp {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProp> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  // Function to check if user is admin
  const checkAdminRole = (userData: User | null): boolean => {
    if (!userData) return false;

    // Check based on role field if it exists
    if (userData.role) {
      return userData.role === "admin" || userData.role === "superadmin";
    }

    // Fallback: Check email or other criteria
    return (
      userData.email === process.env.REACT_APP_ADMIN_EMAIL ||
      userData.email.includes("admin") ||
      userData.email.endsWith("@admin.com")
    );
  };

  // Initialize auth on mount
  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const cachedUser = authService.fetchUser();

        if (cachedUser && authService.validateStoredUser()) {
          setUser(cachedUser);
          setIsAuthenticated(true);
          setIsAdmin(checkAdminRole(cachedUser));

          // Then verify with server in background
          try {
            const response = await authService.fetchUserAccount();
            setUser(response.user);
            setIsAdmin(checkAdminRole(response.user));
          } catch (err) {
            console.error("Background auth verification failed:", err);
            // Keep using cached user if server verification fails
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err) {
        setError("Authentication initialization failed");
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        throw err;
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const checkAuth = React.useCallback(async (force = false) => {
    try {
      setIsLoading(true);
      const response = await authService.fetchUserAccount(force);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(checkAdminRole(response.user));
      return response;
    } catch (err) {
      const cachedUser = authService.fetchUser();
      if (!cachedUser) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setError("Authentication failed");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const silentCheckAuth = React.useCallback(async () => {
    try {
      const cachedUser = authService.fetchUser();
      if (!cachedUser || !authService.validateStoredUser()) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        return false;
      }

      const response = await authService.fetchUserAccount(false);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(checkAdminRole(response.user));
      return true;
    } catch (err) {
      const cachedUser = authService.fetchUser();
      if (cachedUser && authService.validateStoredUser()) {
        setUser(cachedUser);
        setIsAuthenticated(true);
        setIsAdmin(checkAdminRole(cachedUser));
        setError(
          err instanceof Error
            ? err.message
            : "Authentication verification failed"
        );
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        return false;
      }
    }
  }, []);

  const login = React.useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      let user: User | null = null;
      if (response.user) {
        user = response.user;
      } else {
        user = response as unknown as User;
      }

      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(checkAdminRole(user));
      setError(null);
      return { user, isAdmin: checkAdminRole(user) };
    } catch (err) {
      setError(err instanceof Error ? err.message : "login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const googleLogin = React.useCallback(
    async (tokenData: GoogleLoginRequest) => {
      try {
        setIsLoading(true);
        const response = await authService.googleLogin(tokenData);
        let user: User | null = null;
        if (response.user) {
          user = response.user;
        } else {
          user = response as unknown as User;
        }

        setUser(user);
        setIsAuthenticated(true);
        setIsAdmin(checkAdminRole(user));
        setError(null);
        return { user, isAdmin: checkAdminRole(user) };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google login failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = React.useCallback(async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      let user: User | null = null;
      if (response.user) {
        user = response.user;
      } else {
        user = response as unknown as User;
      }
      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(checkAdminRole(user));
      setError(null);
      return { user, isAdmin: checkAdminRole(user) };
    } catch (err) {
      setError(err instanceof Error ? err.message : "registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "logout failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAccount = React.useCallback(
    async (updatedUser: UpdateUserData) => {
      try {
        setIsLoading(true);
        const response = await authService.updateUserAccount(updatedUser);
        setUser(response.user);
        setIsAdmin(checkAdminRole(response.user));
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Updating account failed"
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteAccount = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.deleteUserAccount();

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deleting account failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading: isLoading || !isInitialized,
    isAuthenticated,
    isAdmin, // Add this to context
    error,
    checkAuth,
    silentCheckAuth,
    login,
    googleLogin,
    register,
    logout,
    updateAccount,
    deleteAccount,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};
