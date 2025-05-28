import { createFileRoute, redirect } from '@tanstack/react-router';
import { useFetchParticipants } from '../../hooks/useFetchParticipants';
import { Spinner } from '../../components/Spinner';
import { ErrorAlert } from '../../components/ErrorAlert';
import { Quizzes } from '../../components/Quizzes';
import { AdminHeader } from '../../components/AdminHeader';
import styles from './styles.module.scss';

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
    const navigate = Route.useNavigate();
    const { data, isLoading, error } = useFetchParticipants();

    if (isLoading) return <Spinner />;
    if (error) return <ErrorAlert error={error} />;

    return (
        <div className={styles.adminContainer}>
            <AdminHeader navigate={navigate} />
            <Quizzes />
        </div>
    );
}
