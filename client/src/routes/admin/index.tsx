import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useFetchParticipants } from '../../hooks/useFetchParticipants';
import { useLogout } from '../../hooks/useLogout';
import { Spinner } from '../../components/Spinner';
import { ErrorAlert } from '../../components/ErrorAlert';

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

    if (isLoading) return <Spinner />;
    if (error) return <ErrorAlert error={error} />;

    return (
        <>
            <h2>Admin Dashboard</h2>
            <p>Participants: {data?.data.length || 0}</p>
            <ul>
                {data?.data.map((participant) => (
                    <li key={participant.id}>{participant.full_name}</li>
                ))}
            </ul>
            <button
                className="button"
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
            >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
        </>
    );
}
