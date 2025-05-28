import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { AuthContextType } from '../services/auth';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

interface MyRouterContext {
    auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <div className="layout">
            <Navigation />
            <Outlet />
            <Footer />
        </div>
    );
}
