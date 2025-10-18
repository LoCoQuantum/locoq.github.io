"use client"
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Execution() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectName = searchParams.get("project");

    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setCompleted(true);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <Button
                    onClick={() => router.push("/projects")}
                    variant="ghost"
                    className="glass text-white mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="glass-card rounded-3xl p-10 mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {completed ? "Execution Complete" : "Running on Quantum Processor"}
                    </h1>
                    <p className="text-white/70">{projectName}</p>
                </div>

                {!completed ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6">
                            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-cyan-400" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-4">Executing...</h3>
                        <div className="max-w-md mx-auto h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-cyan-400 mt-2">{progress}%</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-12 h-12 text-green-400" />
                                <div>
                                    <h3 className="text-white font-bold text-xl">Success</h3>
                                    <p className="text-white/60">Algorithm executed in 12.4s</p>
                                </div>
                            </div>
                            <Button className="glass text-white">
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </Button>
                        </div>

                        <div className="grid grid-cols-4 gap-6">
                            <div className="glass-card rounded-xl p-6 text-center">
                                <p className="text-white/50 text-sm mb-2">Qubits</p>
                                <p className="text-white font-bold text-3xl">32</p>
                            </div>
                            <div className="glass-card rounded-xl p-6 text-center">
                                <p className="text-white/50 text-sm mb-2">Depth</p>
                                <p className="text-white font-bold text-3xl">45</p>
                            </div>
                            <div className="glass-card rounded-xl p-6 text-center">
                                <p className="text-white/50 text-sm mb-2">Fidelity</p>
                                <p className="text-green-400 font-bold text-3xl">95.6%</p>
                            </div>
                            <div className="glass-card rounded-xl p-6 text-center">
                                <p className="text-white/50 text-sm mb-2">Time</p>
                                <p className="text-white font-bold text-3xl">12.4s</p>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-8">
                            <h3 className="text-white font-bold text-xl mb-6">Results</h3>
                            <div className="space-y-4">
                                {[
                                    { state: "000", prob: 23 },
                                    { state: "001", prob: 18 },
                                    { state: "010", prob: 15 },
                                    { state: "011", prob: 12 }
                                ].map((result) => (
                                    <div key={result.state} className="glass rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-mono">|{result.state}⟩</span>
                                            <span className="text-cyan-400 font-bold">{result.prob}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                                style={{ width: `${result.prob}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}