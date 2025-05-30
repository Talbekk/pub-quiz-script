import type { FunctionComponent } from 'react';
import { QuizLink } from './components/QuizLink';
import { QuizDate } from './components/QuizDate';

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
            <QuizDate quiz={quiz} />
            <QuizLink quiz={quiz} />
            <td>{quiz.entries.length}</td>
        </tr>
    );
};
