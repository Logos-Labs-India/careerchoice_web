import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<any, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<any, Error, RegisterData>;
  completeProfileMutation: UseMutationResult<any, Error, ProfileData>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type ProfileData = {
  phoneNumber: string;
  grade: string;
  school?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/auth/status"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    select: (data: any) => (data?.authenticated ? data.user : null),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/auth/status"] });
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });
      
      // Redirect to the appropriate page
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/auth/signup", userData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/auth/status"] });
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      
      // Redirect to profile completion
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account",
        variant: "destructive",
      });
    },
  });

  const completeProfileMutation = useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const res = await apiRequest("POST", "/auth/complete-profile", profileData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/auth/status"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been completed successfully.",
      });
      
      // Redirect to dashboard
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Profile update failed",
        description: error.message || "Failed to update your profile",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/auth/status"], { authenticated: false });
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        completeProfileMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}