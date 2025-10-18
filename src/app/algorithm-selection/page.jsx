import { Suspense } from 'react';
import AlgorithmSelectionClient from './AlgorithmSelectionClient';

function Loading() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white">Loading...</h1>
            </div>
        </div>
    );
}

export default function AlgorithmSelectionPage() {
    return (
        <Suspense fallback={<Loading />}>
            <AlgorithmSelectionClient />
        </Suspense>
    );
}