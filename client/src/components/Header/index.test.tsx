import { render, screen } from '@testing-library/react';
import { Header } from '.';

describe('Header', () => {
    it('renders correctly', () => {
        render(<Header />);
        expect(screen.getByText('Pub Quiz')).toBeInTheDocument();
    });
});
