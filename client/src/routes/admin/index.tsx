import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
    component: Admin,
});

function Admin() {
    return <p>Hello from Admin!</p>;
}   