import React from 'react';
import { Database, GitBranch, Layers, Binary, Zap, Settings } from 'lucide-react';

export const toolboxItems = [
    {
        type: 'encoding',
        name: 'Data Encoding',
        icon: Database,
        color: 'from-blue-400 to-cyan-500',
        options: ['Amplitude Encoding', 'Phase Encoding', 'Basis Encoding', 'Pauli Correlation Encoding'],
    },
    {
        type: 'ansatz',
        name: 'Ansatz',
        icon: Layers,
        color: 'from-green-400 to-emerald-500',
        options: ['Hardware Efficient', 'UCCSD', 'RY-RZ', 'Custom'],
    },
    {
        type: 'gates',
        name: 'Quantum Gates',
        icon: GitBranch,
        color: 'from-purple-400 to-pink-500',
        options: ['Hadamard', 'CNOT', 'Toffoli', 'RY', 'RZ'],
    },
    {
        type: 'optimizer',
        name: 'Optimizer',
        icon: Zap,
        color: 'from-amber-400 to-orange-500',
        options: ['COBYLA', 'SPSA', 'Adam', 'Gradient Descent'],
    },
    {
        type: 'measurement',
        name: 'Measurement',
        icon: Binary,
        color: 'from-red-500 to-rose-500',
        options: ['Computational Basis', 'Pauli String', 'Tomography'],
    },
    {
        type: 'params',
        name: 'Parameters',
        icon: Settings,
        color: 'from-gray-400 to-gray-500',
        options: ['Set Iterations', 'Define Shots', 'Error Mitigation Level'],
    },
];

const ToolboxItem = ({ item }) => {
    const onDragStart = (event, itemType) => {
        event.dataTransfer.setData('application/reactflow', itemType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
            className="glass-card rounded-xl p-4 cursor-grab hover:bg-white/10"
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white text-sm font-semibold">{item.name}</p>
            </div>
        </div>
    );
};

export default function ToolboxPanel() {
    return (
        <div className="h-full glass-card rounded-2xl p-4 overflow-y-auto">
            <h2 className="text-white font-bold text-lg mb-4 px-2">Components</h2>
            <div className="space-y-3">
                {toolboxItems.map((item) => (
                    <ToolboxItem key={item.type} item={item} />
                ))}
            </div>
        </div>
    );
}