import { Outlet } from '@tanstack/react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import styles from './styles.module.scss';

export const Layout = () => {
  return (
    <div className={styles.baseLayout}>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
