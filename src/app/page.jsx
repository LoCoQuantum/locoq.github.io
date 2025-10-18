"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Shield, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Welcome Message */}
        {user && (
          <div className="glass-card rounded-2xl px-6 py-3 inline-block mb-8">
            <p className="text-white/80">Welcome, <span className="text-cyan-400 font-semibold">{user.full_name}</span></p>
          </div>
        )}

        {/* Hero Section */}
        <div className="glass-card rounded-3xl p-12 text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-6">
            Low-code Quantum Computing Platform
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Design and execute quantum algorithms for real-world applications
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push("/scenario-selection")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl"
            >
              Start New Project
            </Button>
            <Button
              onClick={() => router.push("/projects")}
              variant="outline"
              className="glass text-white border-white/20 px-8 py-6 text-lg rounded-xl"
            >
              View Projects
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Visual Design</h3>
            <p className="text-white/60 text-sm">Intuitive graphical user interface for quantum circuit design</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Real-time Validation</h3>
            <p className="text-white/60 text-sm">Instant algorithm verification on simulators</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Multi-QPU Access</h3>
            <p className="text-white/60 text-sm">Run on leading quantum processors</p>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-2xl p-8 mt-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-cyan-400 mb-2">50+</p>
              <p className="text-white/60 text-sm">Algorithms</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-400 mb-2">12</p>
              <p className="text-white/60 text-sm">Quantum Processors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-pink-400 mb-2">99.9%</p>
              <p className="text-white/60 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}