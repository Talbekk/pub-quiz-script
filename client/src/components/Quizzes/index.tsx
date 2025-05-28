import type { FunctionComponent } from 'react';
import styles from './styles.module.scss';

export const Quizzes: FunctionComponent = () => {
    return (
        <div className={styles.quizzesContainer}>
            <h2>Quizzes</h2>
            <p>List of quizzes will be displayed here.</p>
            <table className={styles.quizzesTable}>
                <tr>
                    <th>Number</th>
                    <th>Date</th>
                    <th>Link</th>
                    <th>Entries</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>2023-01-01</td>
                    <td>
                        <a href="/quizzes/1">View Quiz</a>
                    </td>
                    <td>10</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>2023-01-02</td>
                    <td>
                        <a href="/quizzes/2">View Quiz</a>
                    </td>
                    <td>5</td>
                </tr>
            </table>
        </div>
    );
};
