import type { FunctionComponent } from 'react';

interface QuizzesTableRowProps {
    quiz: any;
    index: number;
}

export const QuizzesTableRow: FunctionComponent<QuizzesTableRowProps> = ({
    quiz,
    index,
}) => {
    return (
        <tr key={quiz.id}>
            <td>{index + 1}</td>
            <td>{quiz.start_datetime}</td>
            <td>
                <a href={`/quizzes/${quiz.id}`}>View Quiz</a>
            </td>
            <td>{quiz.entries.length}</td>
        </tr>
    );
};
