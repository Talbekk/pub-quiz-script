import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useFetchParticipants } from '../../hooks/useFetchParticipants';
import { useLogout } from '../../hooks/useLogout';

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
    const { data, isLoading, error } = useFetchParticipants();

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

    if (isLoading) return <div>Loading participants...</div>;
    if (error) return <div>Error loading participants: {error.message}</div>;

    return (
        <>
            <p>Hello from Admin!</p>
            <p>Participants: {data?.data.length || 0}</p>
            <ul>
                {data?.data.map((participant) => (
                    <li key={participant.id}>{participant.full_name}</li>
                ))}
            </ul>
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
