import { createRootRouteWithContext } from '@tanstack/react-router';
import type { AuthContextType } from '../services/auth';
import { Layout } from './-layout';

interface MyRouterContext {
    auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => <Layout />,
});
