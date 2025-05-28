import type { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import { QuizzesTableRow } from '../QuizzesTableRow';

export const QuizzesTable: FunctionComponent<{ quizzes: any[] }> = ({
    quizzes,
}) => {
    return (
        <div className={styles.quizzesContainer}>
            <table className={styles.quizzesTable}>
                <tr>
                    <th>Quiz</th>
                    <th>Date</th>
                    <th>Link</th>
                    <th>Entries</th>
                </tr>
                {quizzes.map((quiz, index) => (
                    <QuizzesTableRow key={quiz.id} quiz={quiz} index={index} />
                ))}
            </table>
        </div>
    );
};
