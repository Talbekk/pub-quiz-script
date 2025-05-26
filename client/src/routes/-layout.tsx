import { Outlet } from '@tanstack/react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export const Layout = () => {
    return (
        <div className="layout">
            <Navigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
