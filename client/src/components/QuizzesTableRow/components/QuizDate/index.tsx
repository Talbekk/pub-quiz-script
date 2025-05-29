import { Temporal } from 'temporal-polyfill';

export const QuizDate = ({ quiz }: { quiz: any }) => {
    return (
        <td>
            {Temporal.Instant.fromEpochMilliseconds(quiz.start_datetime)
                .toZonedDateTimeISO('Europe/London')
                .toPlainDate()
                .toString()}
        </td>
    );
};
