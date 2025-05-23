import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import type { AuthContextType } from '../services/auth';

interface MyRouterContext {
    auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => (
        <>
            <Navigation />
            <Outlet />
            <Footer />
            <TanStackRouterDevtools />
        </>
    ),
});
