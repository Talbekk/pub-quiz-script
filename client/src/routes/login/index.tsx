import { createFileRoute, redirect } from '@tanstack/react-router';
import styles from './styles.module.scss';
import { Login } from '../../components/Login';

export const Route = createFileRoute('/login/')({
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: '/admin' });
        }
    },
    component: LoginComponent,
});

function LoginComponent() {
    const navigate = Route.useNavigate();

    return (
        <section className={styles.loginContainer}>
            <h3>Admin Login</h3>
            <Login navigate={navigate} />
        </section>
    );
}
