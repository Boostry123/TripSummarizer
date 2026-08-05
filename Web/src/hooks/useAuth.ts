import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/Apis/authService";
import { useAuthStore } from "@/store/authStore";
import { LoginCredentials, RegisterCredentials } from "@/Types/auth";
import { useEffect } from "react";

/**
 * Hook for authentication actions
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    token,
    login: setLogin,
    signup: setSignup,
    signout: setSignout,
    setUser,
    user: storeUser,
    expiresAt,
    refreshAccessToken,
  } = useAuthStore();

  // Query to fetch the user profile if we have a token but no user in store
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user", token],
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      const userData = response.user;
      setUser(userData);
      return { user: userData };
    },
    enabled: !!token && !storeUser,
    staleTime: Infinity, // Profile doesn't change often
  });

  // Check if token needs refresh
  useEffect(() => {
    if (!expiresAt || !token) return;

    const checkRefresh = () => {
      const timeLeft = expiresAt - Date.now();
      // Refresh if less than 5 minutes left
      if (timeLeft < 5 * 60 * 1000) {
        refreshAccessToken();
      }
    };

    checkRefresh();
    const interval = setInterval(checkRefresh, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [expiresAt, token, refreshAccessToken]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setLogin(data.user, data.token, data.refreshToken);
      queryClient.setQueryData(["user", `Bearer ${data.token}`], {
        user: data.user,
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.signup(credentials),
    onSuccess: (data) => {
      setSignup(data.user, data.token, data.refreshToken);
      queryClient.setQueryData(["user", `Bearer ${data.token}`], {
        user: data.user,
      });
    },
  });

  const signout = () => {
    setSignout();
    queryClient.clear();
  };

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,

    signout,
    isLoadingProfile,
    user: storeUser || profileData?.user,
    isAuthenticated: !!token,
  };
};
