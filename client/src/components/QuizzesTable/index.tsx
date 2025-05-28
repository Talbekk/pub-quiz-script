import type { FunctionComponent } from 'react';
import styles from './styles.module.scss';

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
                    <tr key={quiz.id}>
                        <td>{index + 1}</td>
                        <td>{quiz.start_datetime}</td>
                        <td>
                            <a href={`/quizzes/${quiz.id}`}>View Quiz</a>
                        </td>
                        <td>{quiz.entries.length}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};
