"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Pill, GraduationCap, Atom, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScenarioSelection() {
    const router = useRouter();
    const [selectedScenario, setSelectedScenario] = useState(null);

    const scenarios = [
        {
            id: "finance",
            icon: DollarSign,
            title: "Finance",
            description: "Portfolio optimization and risk analysis",
            color: "from-green-400 to-emerald-500"
        },
        {
            id: "pharma",
            icon: Pill,
            title: "Pharmaceutical",
            description: "Drug discovery and molecular simulation",
            color: "from-pink-400 to-rose-500"
        },
        {
            id: "education",
            icon: GraduationCap,
            title: "Education",
            description: "Learn quantum computing fundamentals",
            color: "from-blue-400 to-indigo-500"
        },
        {
            id: "materials",
            icon: Atom,
            title: "Materials Science",
            description: "Discover new materials and simulations",
            color: "from-purple-400 to-violet-500"
        },
        {
            id: "cryptography",
            icon: Lock,
            title: "Cryptography",
            description: "Quantum-safe security protocols",
            color: "from-orange-400 to-red-500"
        }
    ];

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <Button
                    onClick={() => router.push("/")}
                    variant="ghost"
                    className="glass text-white mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="glass-card rounded-3xl p-10 mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Choose Application Scenario</h1>
                    <p className="text-white/70 text-lg">Select your domain to begin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {scenarios.map((scenario) => (
                        <div
                            key={scenario.id}
                            onClick={() => setSelectedScenario(scenario.id)}
                            className={`glass-card rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all ${selectedScenario === scenario.id ? "ring-2 ring-cyan-400" : ""
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center mb-4`}>
                                <scenario.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">{scenario.title}</h3>
                            <p className="text-white/60 text-sm">{scenario.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Button
                        onClick={() => selectedScenario && router.push(`/algorithm-selection?scenario=${selectedScenario}`)}
                        disabled={!selectedScenario}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-12 py-6 text-lg rounded-xl disabled:opacity-50"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}