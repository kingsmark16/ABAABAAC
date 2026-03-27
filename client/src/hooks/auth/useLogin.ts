import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials): Promise<LoginResponse> => authService.login(credentials),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: AUTH_SESSION_QUERY_KEY, type: 'active' });
    },
  });
}
