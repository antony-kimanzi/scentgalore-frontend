/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DeleteResponse,
  LoginRequest,
  LogoutResponse,
  RegisterRequest,
  UpdateUserData,
  User,
  UserResponse,
  GoogleLoginRequest, // Add this
} from "../utils/types";
import { api } from "./api";

class AuthService {
  private readonly basePath = "/auth";
  private storageKey = "user-data";
  private lastAuthCheck: number = 0;
  private readonly AUTH_CHECK_THROTTLE = 30000; // 30 seconds

  private storeUserData(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.lastAuthCheck = Date.now();
  }

  private fetchStoredUserData(): User | null {
    try {
      const user = localStorage.getItem(this.storageKey);
      return user ? JSON.parse(user) : null;
    } catch (error: any) {
      console.error("Error reading user data from storage:", error);
      this.clearUserData();
      return null;
    }
  }

  private clearUserData(): void {
    localStorage.removeItem(this.storageKey);
    this.lastAuthCheck = 0;
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    try {
      const response = await api.post<UserResponse>(
        `${this.basePath}/register`,
        userData,
      );
      this.storeUserData(response.data.user);

      return response.data;
    } catch (error: any) {
      this.clearUserData();
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  }

  async login(credentials: LoginRequest): Promise<UserResponse> {
    try {
      const response = await api.post<UserResponse>(
        `${this.basePath}/login`,
        credentials,
      );
      this.storeUserData(response.data.user);

      return response.data;
    } catch (error: any) {
      this.clearUserData();
      throw new Error(error.response?.data?.error || "Login failed");
    }
  }

  // ADD GOOGLE LOGIN METHOD
  async googleLogin(tokenData: GoogleLoginRequest): Promise<UserResponse> {
    try {
      const response = await api.post<UserResponse>(
        `${this.basePath}/google`,
        tokenData,
      );
      this.storeUserData(response.data.user);

      return response.data;
    } catch (error: any) {
      this.clearUserData();
      throw new Error(error.response?.data?.error || "Google login failed");
    }
  }

  async fetchUserAccount(force = false): Promise<UserResponse> {
    // Throttle API calls to prevent excessive requests
    const now = Date.now();
    if (!force && now - this.lastAuthCheck < this.AUTH_CHECK_THROTTLE) {
      const cachedUser = this.fetchStoredUserData();
      if (cachedUser) {
        return { user: cachedUser };
      }
    }

    try {
      const response = await api.get<UserResponse>("/account");
      this.storeUserData(response.data.user);
      return response.data;
    } catch (error: any) {
      // If unauthorized, clear cached data
      if (error.response?.status === 401) {
        this.clearUserData();
      }
      throw new Error(
        error.response?.data?.error || "Fetching user account failed",
      );
    }
  }

  async updateUserAccount(updatedUser: UpdateUserData): Promise<UserResponse> {
    try {
      const response = await api.patch<UserResponse>("/account", updatedUser);
      this.storeUserData(response.data.user);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data.error || "Updating user account failed",
      );
    }
  }

  async deleteUserAccount(): Promise<DeleteResponse> {
    try {
      const response = await api.delete<DeleteResponse>("/account");
      this.clearUserData();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Deleting account failed");
    }
  }

  async logout(): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>(`${this.basePath}/logout`);
    this.clearUserData();
    return response.data;
  }

  isLoggedIn(): boolean {
    return this.fetchStoredUserData() !== null;
  }

  fetchUser(): User | null {
    return this.fetchStoredUserData();
  }

  // Quick check that doesn't make API calls
  hasStoredUser(): boolean {
    return this.fetchStoredUserData() !== null;
  }

  // Add a quick validation method
  validateStoredUser(): boolean {
    const user = this.fetchStoredUserData();
    if (!user) return false;

    // Basic validation - you can add more checks here
    return !!(user.id && user.email);
  }
}

export const authService = new AuthService();
