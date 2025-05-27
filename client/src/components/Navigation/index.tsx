import { Link } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';
import styles from './styles.module.scss';

export const Navigation: FunctionComponent = () => {
    return (
        <div className={styles.navigation}>
            <Link to="/">Home</Link>
        </div>
    );
};
