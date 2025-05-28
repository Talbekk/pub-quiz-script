import { createFileRoute, redirect } from '@tanstack/react-router';
import { Spinner } from '../../components/Spinner';
import { ErrorAlert } from '../../components/ErrorAlert';
import { QuizzesTable } from '../../components/QuizzesTable';
import { AdminHeader } from '../../components/AdminHeader';
import styles from './styles.module.scss';
import { useFetchQuizzes } from '../../hooks/useFetchQuizzes';

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
    const { data, isLoading, error } = useFetchQuizzes();

    if (isLoading) return <Spinner />;
    if (error) return <ErrorAlert error={error} />;
    if (!data) return null;
    console.log(`data: `, data);

    return (
        <div className={styles.adminContainer}>
            <AdminHeader navigate={navigate} />
            <QuizzesTable quizzes={data.data} />
        </div>
    );
}
