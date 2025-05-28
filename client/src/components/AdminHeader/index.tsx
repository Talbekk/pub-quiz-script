import { useRouter } from '@tanstack/react-router';
import { useCallback, type FunctionComponent } from 'react';
import { useLogout } from '../../hooks/useLogout';
import styles from './styles.module.scss';

interface AdminHeaderProps {
    navigate: any;
}

export const AdminHeader: FunctionComponent<AdminHeaderProps> = ({
    navigate,
}) => {
    const router = useRouter();
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
        <section className={styles.adminHeaderContainer}>
            <h2>Admin Dashboard</h2>
            <button
                className="button"
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
            >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
        </section>
    );
};
