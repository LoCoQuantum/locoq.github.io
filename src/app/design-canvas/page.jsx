"use client";

import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toolboxItems } from "@/components/locoq-canvas/toolbox-panel";
import ToolboxPanel from "@/components/locoq-canvas/toolbox-panel";
import CanvasArea from "@/components/locoq-canvas/canvas-area";
import ValidationPanel from "@/components/locoq-canvas/validation-panel";

function Loading() {
    return (
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Loading Canvas...</h1>
        </div>
    );
}

function DesignCanvas() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedQPU, setSelectedQPU] = useState("ibm_eagle");
    const [projectName, setProjectName] = useState("New Project");
    const [scenario, setScenario] = useState("finance");
    const [algorithmType, setAlgorithmType] = useState("QAOA");
    const [projectId, setProjectId] = useState(null);

    const canvasRef = useRef(null);

    useEffect(() => {
        console.log("Canvas is re-evaluating with searchParams:", searchParams.toString());
        const projectIdFromUrl = searchParams.get('projectId');
        const nameFromUrl = searchParams.get('name');
        const scenarioFromUrl = searchParams.get('scenario');
        const typeFromUrl = searchParams.get('type');

        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
            const projects = JSON.parse(localStorage.getItem("quantumProjects") || "[]");
            const project = projects.find(p => p.id === projectIdFromUrl);
            if (project) {
                setProjectName(project.name);
                setScenario(project.scenario);
                setAlgorithmType(project.algorithmType);

                // Rehydrate nodes with their icon components after loading from localStorage.
                const rehydratedNodes = (project.nodes || []).map(node => {
                    const toolboxItem = toolboxItems.find(item => item.type === node.type);
                    return {
                        ...node,
                        icon: toolboxItem ? toolboxItem.icon : null, // Fallback to null
                    };
                });
                setNodes(rehydratedNodes);
                setConnections(project.connections || []);
            }
        } else {
            setProjectName(nameFromUrl || "New Project");
            setScenario(scenarioFromUrl || "finance");
            setAlgorithmType(typeFromUrl || "QAOA");
            setNodes([]);
            setConnections([]);
            setProjectId(null);
        }
    }, [searchParams]);

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

    const handleNodeConfigChange = (nodeId, selectedOption) => {
        setNodes((currentNodes) =>
            currentNodes.map((node) =>
                node.id === nodeId ? { ...node, selectedOption } : node
            )
        );
    };

    const handleDeleteNode = (nodeId) => {
        setNodes((currentNodes) => currentNodes.filter((node) => node.id !== nodeId));
        setConnections((currentConnections) =>
            currentConnections.filter(
                (conn) => conn.from.nodeId !== nodeId && conn.to.nodeId !== nodeId
            )
        );
    };

    const saveProject = (status) => {
        try {
            const projects = JSON.parse(localStorage.getItem("quantumProjects") || "[]");

            let projectData = {
                name: projectName,
                scenario: scenario,
                algorithmType: algorithmType,
                nodes: nodes,
                connections: connections,
                modifiedAt: new Date().toISOString(),
                status: status,
            };

            if (projectId) {
                const existingProjectIndex = projects.findIndex(p => p.id === projectId);
                if (existingProjectIndex !== -1) {
                    const existingProject = projects[existingProjectIndex];
                    projects[existingProjectIndex] = { ...existingProject, ...projectData, id: projectId };
                    localStorage.setItem("quantumProjects", JSON.stringify(projects));
                    console.log("Project updated with status:", status);
                    return projectId;
                }
            }

            const newProjectId = `proj-${Date.now()}`;
            projectData.id = newProjectId;
            projectData.createdAt = new Date().toISOString();
            projects.push(projectData);
            localStorage.setItem("quantumProjects", JSON.stringify(projects));
            setProjectId(newProjectId);
            console.log("Project saved with status:", status);
            return newProjectId;

        } catch (error) {
            console.error("Failed to save project:", error);
            return null;
        }
    };

    const handleSaveClick = () => {
        setIsSaving(true);
        saveProject('saved');
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleRun = () => {
        const projectId = saveProject('draft');
        if (projectId) {
            router.push(`/execution?qpu=${selectedQPU}&project=${projectName}&projectId=${projectId}`);
        }
    };

    return (
        <div className="h-screen flex flex-col p-4 gap-4">
            {/* Header */}
            <div className="flex-shrink-0 glass-card rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.push(projectId ? '/projects' : `/algorithm-selection?scenario=${scenario}`)}
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
                        onClick={handleSaveClick}
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
                        setConnections={setConnections}
                        onDrop={addNode}
                        onNodeMove={updateNodePosition}
                        onNodeConfigChange={handleNodeConfigChange}
                        onDeleteNode={handleDeleteNode}
                    />
                </div>

                {/* Validation & Run */}
                <div className="w-80 flex-shrink-0">
                    <ValidationPanel
                        selectedQPU={selectedQPU}
                        setSelectedQPU={setSelectedQPU}
                        onRun={handleRun}
                        projectName={projectName}
                    />
                </div>
            </div>
        </div>
    );
}

export default function DesignCanvasPage() {
    return (
        <Suspense fallback={<Loading />}>
            <DesignCanvas />
        </Suspense>
    );
}