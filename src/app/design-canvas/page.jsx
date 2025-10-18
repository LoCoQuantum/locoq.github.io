import { Suspense } from 'react';
import DesignCanvasClient from './DesignCanvasClient';
function Loading() {
    return (
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Loading Canvas...</h1>
        </div>
    );
}

export default function DesignCanvasPage() {
    return (
        <Suspense fallback={<Loading />}>
            <DesignCanvasClient />
        </Suspense>
    );
}