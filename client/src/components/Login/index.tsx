import { useRouter, useRouterState } from '@tanstack/react-router';
import {
    useCallback,
    useMemo,
    useState,
    type FormEvent,
    type FunctionComponent,
} from 'react';
import { useLogin } from '../../hooks/useLogin';
import styles from './styles.module.scss';

interface LoginProps {
    navigate: any;
}

export const Login: FunctionComponent<LoginProps> = ({ navigate }) => {
    const router = useRouter();
    const isLoading = useRouterState({ select: (s) => s.isLoading });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loginMutation = useLogin();

    const onFormSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            setIsSubmitting(true);
            try {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const username = data.get('username')?.toString();
                const password = data.get('password')?.toString();

                if (!username || !password) return;

                await loginMutation.mutateAsync({ username, password });

                await router.invalidate();
                await navigate({ to: '/admin' });
            } catch (error) {
                console.error('Error logging in: ', error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [loginMutation, router, navigate],
    );
    const isLoggingIn = useMemo(
        () => isLoading || isSubmitting || loginMutation.isPending,
        [isLoading, isSubmitting, loginMutation],
    );

    return (
        <form onSubmit={onFormSubmit} className={styles.loginForm}>
            <fieldset disabled={isLoggingIn} className={styles.fieldset}>
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
                <button type="submit" className="button" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Loading...' : 'Login'}
                </button>
            </fieldset>
        </form>
    );
};
