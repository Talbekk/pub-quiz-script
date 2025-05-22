import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export const Route = createRootRoute({
    component: () => (
        <>
            <Navigation />
            <Outlet />
            <Footer />
            <TanStackRouterDevtools />
        </>
    ),
});
