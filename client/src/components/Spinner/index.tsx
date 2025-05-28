import type { FunctionComponent } from 'react';
import styles from './styles.module.scss';

export const Spinner: FunctionComponent = () => {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.loader}></div>
            <h2>Loading Quizzes...</h2>
        </div>
    );
};
