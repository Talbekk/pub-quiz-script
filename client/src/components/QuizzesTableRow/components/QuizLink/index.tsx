import type { FunctionComponent } from 'react';

interface QuizLinkProps {
    quiz: any;
}

export const QuizLink: FunctionComponent<QuizLinkProps> = ({ quiz }) => {
    if (quiz.url.length === 1) {
        return (
            <td>
                <a href={quiz.url[0]} target="_blank" rel="noopener noreferrer">
                    View Quiz
                </a>
            </td>
        );
    }
    if (quiz.url.length > 1) {
        return (
            <td>
                {quiz.url.map((url: any, index: number) => (
                    <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Quiz
                    </a>
                ))}
            </td>
        );
    }

    return (
        <td>
            <span>N/A</span>
        </td>
    );
};
