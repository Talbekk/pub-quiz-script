import type { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface ErrorAlertProps {
    error: Error;
}

export const ErrorAlert: FunctionComponent<ErrorAlertProps> = ({ error }) => {
    return (
        <div className={styles.errorAlertContainer}>
            <h2>Error</h2>
            <p>
                {error.message ||
                    'Something went wrong. Please try again later.'}
            </p>
        </div>
    );
};
