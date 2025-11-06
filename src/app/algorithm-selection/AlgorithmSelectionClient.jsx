"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Cpu, Network, Binary, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AlgorithmSelectionClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scenario = searchParams.get("scenario");

    const [projectName, setProjectName] = useState("");
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

    const algorithms = [
        {
            id: "qaoa",
            type: "QAOA",
            name: "QAOA - Optimization",
            description: "Quantum optimization for complex problems",
            icon: Network
        },
        {
            id: "vqe",
            type: "VQE",
            name: "VQE - Simulation",
            description: "Variational quantum eigensolver",
            icon: Cpu
        },
        {
            id: "grover",
            type: "Grover",
            name: "Grover's Search",
            description: "Quantum search algorithm",
            icon: Binary
        }
    ];

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <Button
                    onClick={() => router.push("/scenario-selection")}
                    variant="ghost"
                    className="glass text-white mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="glass-card rounded-3xl p-10 mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Select Algorithm</h1>
                    <p className="text-white/70 text-lg mb-6">Choose the quantum algorithm for {scenario}</p>

                    <Input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Project name..."
                        className="bg-white/10 border-white/20 text-white h-12 text-lg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {algorithms.map((algo) => (
                        <div
                            key={algo.id}
                            onClick={() => setSelectedAlgorithm(algo)}
                            className={`glass-card rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all ${selectedAlgorithm?.id === algo.id ? "ring-2 ring-cyan-400" : ""
                                }`}
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
                                <algo.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{algo.name}</h3>
                            <p className="text-white/60 text-sm">{algo.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-4">
                    <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-lg rounded-xl"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Ask AI for suggestions
                    </Button>
                    <Button
                        onClick={() => selectedAlgorithm && projectName && router.push(`/design-canvas?scenario=${scenario}&algorithm=${selectedAlgorithm.id}&type=${selectedAlgorithm.type}&name=${projectName}`)}
                        disabled={!selectedAlgorithm || !projectName}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-12 py-6 text-lg rounded-xl disabled:opacity-50"
                    >
                        Design Algorithm
                    </Button>
                </div>
            </div>
        </div>
    );
}
