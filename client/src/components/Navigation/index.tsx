import { Link } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';

export const Navigation: FunctionComponent = () => {
    return (
        <div>
            <Link to="/">Home</Link> <Link to="/about">About</Link>
        </div>
    );
};
