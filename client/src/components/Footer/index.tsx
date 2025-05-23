import type { FunctionComponent } from 'react';

export const Footer: FunctionComponent = () => {
    return (
        <footer>
            <div>
                <p>
                    &copy; {new Date().getFullYear()} CodingNomad. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};
