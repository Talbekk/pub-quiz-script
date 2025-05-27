import type { FunctionComponent } from 'react';
import styles from './styles.module.scss';

export const Footer: FunctionComponent = () => {
    return (
        <footer className={styles.footer}>
            <p>
                &copy; {new Date().getFullYear()} CodingNomad. All rights
                reserved.
            </p>
        </footer>
    );
};
