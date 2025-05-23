import * as React from 'react';
import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { useAuth } from '../../services/auth';
import { useCallback } from 'react';

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

        // This is just a hack being used to wait for the auth state to update
        // in a real app, you'd want to use a more robust solution

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
    <div>
      <h3>Login page</h3>
      <p>Login to see all the cool content in here.</p>
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
          <button type="submit">{isLoggingIn ? 'Loading...' : 'Login'}</button>
        </fieldset>
      </form>
    </div>
  );
}
