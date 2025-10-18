import { Suspense } from 'react';
import ExecutionClient from './ExecutionClient';

function Loading() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white">Loading Execution...</h1>
            </div>
        </div>
    );
}

export default function ExecutionPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ExecutionClient />
        </Suspense>
    );
}