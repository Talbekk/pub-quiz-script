import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../services/auth';
import { authApi } from '../../api/auth';

export const useLogin = () => {
    const { setUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });
};
