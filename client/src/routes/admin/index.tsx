import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useAuth } from '../../services/auth';

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
    const auth = useAuth();

    const handleLogout = useCallback(() => {
        if (window.confirm('Are you sure you want to logout?')) {
            auth.logout().then(() => {
                router.invalidate().finally(() => {
                    navigate({ to: '/' });
                });
            });
        }
    }, []);
    return (
        <>
            <p>Hello from Admin!</p>
            <button
                type="button"
                className="hover:underline"
                onClick={handleLogout}
            >
                Logout
            </button>
        </>
    );
}
