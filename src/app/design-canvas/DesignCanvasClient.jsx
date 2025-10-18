"use client"

import React, { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolboxPanel, { toolboxItems } from "@/components/locoq-canvas/toolbox-panel";
import CanvasArea from "@/components/locoq-canvas/canvas-area";
import ValidationPanel from "@/components/locoq-canvas/validation-panel";

export default function DesignCanvasClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scenario = searchParams.get("scenario") || "finance";
    const algorithmType = searchParams.get("type") || "QAOA";
    const projectName = searchParams.get("name") || "New Project";

    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedQPU, setSelectedQPU] = useState("ibm_eagle");

    const canvasRef = useRef(null);

    const addNode = useCallback((itemType, position) => {
        const item = toolboxItems.find(i => i.type === itemType);
        if (!item) return;

        const canvasBounds = canvasRef.current.getBoundingClientRect();
        const newNode = {
            ...item,
            id: `${item.type}-${Date.now()}`,
            x: position.x - canvasBounds.left - 120, // Adjust for node width
            y: position.y - canvasBounds.top - 40,   // Adjust for node height
            selectedOption: item.options[0],
        };
        setNodes((currentNodes) => [...currentNodes, newNode]);
    }, [canvasRef]);

    const updateNodePosition = (nodeId, newX, newY) => {
        setNodes((currentNodes) =>
            currentNodes.map((node) =>
                node.id === nodeId ? { ...node, x: newX, y: newY } : node
            )
        );
    };

    const handleSave = () => {
        setIsSaving(true);
        console.log("Saving project:", { projectName, nodes, connections });
        setTimeout(() => setIsSaving(false), 1500);
    };

    const handleRun = () => {
        router.push(`/execution?project=${projectName}`);
    };

    return (
        <div className="h-screen flex flex-col p-4 gap-4">
            {/* Header */}
            <div className="flex-shrink-0 glass-card rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.push(`/algorithm-selection?scenario=${scenario}`)}
                        variant="ghost"
                        className="glass text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-white">{projectName}</h1>
                        <p className="text-white/60 text-sm">{algorithmType} • {scenario}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="glass text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Toolbox */}
                <div className="w-64 flex-shrink-0">
                    <ToolboxPanel />
                </div>

                {/* Canvas */}
                <div className="flex-1" ref={canvasRef}>
                    <CanvasArea
                        nodes={nodes}
                        connections={connections}
                        addNode={addNode}
                        updateNodePosition={updateNodePosition}
                        setConnections={setConnections}
                    />
                </div>

                {/* Validation & Run */}
                <div className="w-80 flex-shrink-0">
                    <ValidationPanel
                        selectedQPU={selectedQPU}
                        setSelectedQPU={setSelectedQPU}
                        onRun={handleRun}
                    />
                </div>
            </div>
        </div>
    );
}