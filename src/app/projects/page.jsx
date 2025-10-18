"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, MoreHorizontal, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Projects() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "draft": return "text-yellow-400";
            case "completed": return "text-green-400";
            case "error": return "text-red-400";
            default: return "text-gray-400";
        }
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Button
                        onClick={() => router.push("/")}
                        variant="ghost"
                        className="glass text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                    <Button
                        onClick={() => router.push("/scenario-selection")}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </div>

                <div className="glass-card rounded-3xl p-8">
                    <h1 className="text-3xl font-bold text-white mb-6">My Projects</h1>
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.id} className="glass rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 transition-all">
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                                    <p className="text-white/60 text-sm">
                                        {project.algorithm_type} • {project.scenario}
                                    </p>
                                </div>
                                <div className="w-48 text-center">
                                    <p className="text-white/60 text-sm">Last Modified</p>
                                    <p className="text-white text-sm">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="w-32 text-center">
                                    <p className={`font-bold ${getStatusColor(project.status)}`}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => router.push(`/execution?project=${project.name}`)}
                                        size="icon"
                                        className="glass text-white"
                                    >
                                        <Play className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="glass text-white">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}