import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../services/auth';
import { authApi } from '../../api/auth';

export const useLogout = () => {
    const { clearUser } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearUser();
            queryClient.clear();
        },
    });
};
