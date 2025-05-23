import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { AuthProvider, useAuth, type AuthContextType } from './services/auth';

// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent', // Preload all routes on hover
    scrollRestoration: true,
    context: {
        auth: {} as AuthContextType,
    },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const InnterApp = () => {
    const auth = useAuth();
    return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => {
    return (
        <AuthProvider>
            <InnterApp />
        </AuthProvider>
    );
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
