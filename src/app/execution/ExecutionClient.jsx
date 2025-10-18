"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExecutionClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectName = searchParams.get("project");
    const projectId = searchParams.get("projectId");

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

    useEffect(() => {
        if (completed && projectId) {
            try {
                const projects = JSON.parse(localStorage.getItem("quantumProjects") || "[]");
                const projectIndex = projects.findIndex(p => p.id === projectId);
                if (projectIndex !== -1) {
                    projects[projectIndex].status = 'completed';
                    projects[projectIndex].completedAt = new Date().toISOString();
                    localStorage.setItem("quantumProjects", JSON.stringify(projects));
                    console.log(`Project ${projectId} status updated to completed.`);
                }
            } catch (error) {
                console.error("Failed to update project status:", error);
            }
        }
    }, [completed, projectId]);

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

                <div className="glass-card rounded-2xl p-8">
                    {completed ? (
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Success</h2>
                            <p className="text-white/70 mb-6">Your quantum algorithm has been executed successfully.</p>
                            <Button className="glass text-white">
                                <Download className="w-4 h-4 mr-2" />
                                Download Results
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-white/80">QPU: IBM Eagle</p>
                                <p className="text-white font-semibold">{progress}%</p>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-center text-white/60 mt-4 text-sm">Estimated time remaining: {Math.round((100 - progress) * 0.1)}s</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}