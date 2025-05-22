import { createFileRoute } from '@tanstack/react-router';
import { Header } from '../components/Header';
import { Description } from '../components/Description';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <>
            <Header />
            <Description />
        </>
    );
}
