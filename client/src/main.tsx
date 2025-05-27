import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { routeTree } from './routeTree.gen';
import { AuthProvider, useAuth, type AuthContextType } from './services/auth';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
        },
        mutations: {},
    },
});

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        auth: {} as AuthContextType,
    },
});
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
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </StrictMode>,
    );
}
