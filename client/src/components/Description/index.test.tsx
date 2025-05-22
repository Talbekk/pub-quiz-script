import { render, screen } from '@testing-library/react';
import { Description } from '.';

describe('Description', () => {
    it('renders correctly', () => {
        render(<Description />);
        expect(
            screen.getByText('Test your knowledge with our pub quiz!'),
        ).toBeInTheDocument();
    });
});
