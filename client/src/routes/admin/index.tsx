import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useLogout } from '../../hooks/useAuthMutations';

export const Route = createFileRoute('/admin/')({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: Admin,
});

function Admin() {
    const router = useRouter();
    const navigate = Route.useNavigate();
    const logoutMutation = useLogout();

    const handleLogout = useCallback(async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await logoutMutation.mutateAsync();
                await router.invalidate();
                await navigate({ to: '/' });
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    }, [logoutMutation, router, navigate]);

    return (
        <>
            <p>Hello from Admin!</p>
            <button
                type="button"
                className="hover:underline"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
            >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
        </>
    );
}
