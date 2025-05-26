import * as React from 'react';
import {
    createFileRoute,
    redirect,
    useRouter,
    useRouterState,
} from '@tanstack/react-router';
import { useAuth } from '../../services/auth';
import { useCallback } from 'react';
import styles from './styles.module.scss';
const fallback = '/' as const;

export const Route = createFileRoute('/login/')({
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: fallback });
        }
    },
    component: LoginComponent,
});

function LoginComponent() {
    const auth = useAuth();
    const router = useRouter();
    const isLoading = useRouterState({ select: (s) => s.isLoading });
    const navigate = Route.useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onFormSubmit = useCallback(
        async (evt: React.FormEvent<HTMLFormElement>) => {
            setIsSubmitting(true);
            try {
                evt.preventDefault();
                const data = new FormData(evt.currentTarget);
                const fieldValue = data.get('username');

                if (!fieldValue) return;
                const username = fieldValue.toString();
                await auth.login(username);

                await router.invalidate();

                await navigate({ to: fallback });
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
            <h3>Login</h3>
            <form onSubmit={onFormSubmit}>
                <fieldset disabled={isLoggingIn}>
                    <div>
                        <label htmlFor="username-input">Username</label>
                        <input
                            id="username-input"
                            name="username"
                            placeholder="Enter your name"
                            type="text"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password-input">Password</label>
                        <input
                            id="password-input"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            required
                        />
                    </div>
                    <button type="submit">
                        {isLoggingIn ? 'Loading...' : 'Login'}
                    </button>
                </fieldset>
            </form>
        </section>
    );
}
