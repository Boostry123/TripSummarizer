import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/Apis/authService';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterCredentials } from '@/Types/auth';
import { useEffect } from 'react';

/**
 * Hook for authentication actions
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { token, login: setLogin, signup: setSignup, signout: setSignout, user: storeUser } = useAuthStore();

  // Query to fetch the user profile if we have a token but no user in store
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user', token],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token && !storeUser,
    staleTime: Infinity, // Profile doesn't change often
  });

  // Sync profile data to store when fetched
  useEffect(() => {
    if (profileData?.user && !storeUser) {
      // Re-save to store to update the in-memory user object
      setLogin(profileData.user, token?.replace('Bearer ', '') || '');
    }
  }, [profileData, storeUser, setLogin, token]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setLogin(data.user, data.token);
      queryClient.setQueryData(['user', `Bearer ${data.token}`], { user: data.user });
    },
  });

  const signupMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.signup(credentials),
    onSuccess: (data) => {
      setSignup(data.user, data.token);
      queryClient.setQueryData(['user', `Bearer ${data.token}`], { user: data.user });
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
