import {
    createFileRoute,
    redirect,
    useRouter,
    useRouterState,
} from '@tanstack/react-router';
import { useAuth } from '../../services/auth';
import { useCallback, useState, type FormEvent } from 'react';
import styles from './styles.module.scss';
const fallback = '/' as const;

export const Route = createFileRoute('/login/')({
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: '/admin' });
        }
    },
    component: LoginComponent,
});

function LoginComponent() {
    const auth = useAuth();
    const router = useRouter();
    const isLoading = useRouterState({ select: (s) => s.isLoading });
    const navigate = Route.useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onFormSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            setIsSubmitting(true);
            try {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const fieldValue = data.get('username');

                if (!fieldValue) return;
                const username = fieldValue.toString();
                await auth.login(username);

                await router.invalidate();

                await navigate({ to: '/admin' });
            } catch (error) {
                console.error('Error logging in: ', error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [auth, router],
    );

    const isLoggingIn = isLoading || isSubmitting;

    return (
        <section className={styles.loginContainer}>
            <h3>Admin Login</h3>
            <form onSubmit={onFormSubmit} className={styles.loginForm}>
                <fieldset disabled={isLoggingIn} className={styles.fieldset}>
                    <legend>Enter your credentials</legend>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            placeholder="Enter your name"
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>
                        {isLoggingIn ? 'Loading...' : 'Login'}
                    </button>
                </fieldset>
            </form>
        </section>
    );
}
