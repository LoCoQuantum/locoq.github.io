import React, { useState, useRef, useEffect } from 'react';
import { X, GitBranch } from 'lucide-react';

const Node = ({ node, onNodeMove, onNodeConfigChange, onDeleteNode, onAnchorClick, isConnecting }) => {
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startNodeX = node.x;
        const startNodeY = node.y;

        const parentBounds = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
        const nodeWidth = e.currentTarget.parentElement.offsetWidth;
        const nodeHeight = e.currentTarget.parentElement.offsetHeight;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newX = startNodeX + dx;
            let newY = startNodeY + dy;

            // Clamp position within parent bounds
            newX = Math.max(0, Math.min(newX, parentBounds.width - nodeWidth));
            newY = Math.max(0, Math.min(newY, parentBounds.height - nodeHeight));

            onNodeMove(node.id, newX, newY);
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className="absolute glass-card rounded-xl shadow-lg w-60 group"
            style={{ left: `${node.x}px`, top: `${node.y}px`, transform: `translate(0, 0)` }}
        >
            <div
                className="handle p-3 border-b border-white/10 flex items-center justify-between cursor-move"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                        <node.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm">{node.name}</p>
                </div>
                <button onClick={() => onDeleteNode(node.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/20">
                    <X className="w-4 h-4 text-red-400" />
                </button>
            </div>
            <div className="p-3">
                <select
                    value={node.selectedOption}
                    onChange={(e) => onNodeConfigChange(node.id, e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-md px-2 py-1.5 text-white text-sm focus:ring-2 focus:ring-cyan-400"
                >
                    {node.options.map((option) => (
                        <option key={option} value={option} className="bg-slate-800">
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            {/* Anchors */}
            <div
                id={`${node.id}-input`}
                onClick={() => onAnchorClick(node.id, 'input')}
                className={`absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full glass border-2 ${isConnecting ? 'border-yellow-400' : 'border-purple-400'} cursor-pointer hover:bg-purple-400`}
            />
            <div
                id={`${node.id}-output`}
                onClick={() => onAnchorClick(node.id, 'output')}
                className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full glass border-2 ${isConnecting ? 'border-yellow-400' : 'border-cyan-400'} cursor-pointer hover:bg-cyan-400`}
            />
        </div>
    );
};

export default function CanvasArea({ nodes, connections, setConnections, onDrop, onNodeMove, onNodeConfigChange, onDeleteNode }) {
    const [dragOver, setDragOver] = useState(false);
    const [connecting, setConnecting] = useState(null); // { nodeId, anchorType }
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const getAnchorPos = (nodeId, anchorType) => {
        const el = document.getElementById(`${nodeId}-${anchorType}`);
        if (!el) return { x: 0, y: 0 };
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        return {
            x: node.x + (anchorType === 'output' ? 240 + 8 : -8),
            y: node.y + 45,
        };
    };

    const handleAnchorClick = (nodeId, anchorType) => {
        if (!connecting) {
            // Start a new connection
            setConnecting({ nodeId, anchorType });
        } else {
            // Complete the connection
            if (connecting.nodeId !== nodeId && connecting.anchorType !== anchorType) {
                const newConnection = connecting.anchorType === 'output'
                    ? { from: { nodeId: connecting.nodeId, anchor: 'output' }, to: { nodeId: nodeId, anchor: 'input' } }
                    : { from: { nodeId: nodeId, anchor: 'output' }, to: { nodeId: connecting.nodeId, anchor: 'input' } };
                setConnections([...connections, newConnection]);
            }
            setConnecting(null);
        }
    };

    useEffect(() => {
        const handleMouseMove = (event) => setMousePos({ x: event.clientX, y: event.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const canvasRef = useRef(null);

    return (
        <div
            ref={canvasRef}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const itemType = e.dataTransfer.getData('application/reactflow');
                onDrop(itemType, { x: e.clientX, y: e.clientY });
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setConnecting(null); }}
            className={`relative h-full glass-card rounded-2xl p-4 overflow-hidden ${dragOver ? 'ring-2 ring-cyan-400' : ''}`}
        >
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
            }} />

            {nodes.map(node => (
                <Node
                    key={node.id}
                    node={node}
                    onNodeMove={onNodeMove}
                    onNodeConfigChange={onNodeConfigChange}
                    onDeleteNode={onDeleteNode}
                    onAnchorClick={handleAnchorClick}
                    isConnecting={!!connecting}
                />
            ))}

            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {connections.map((conn, i) => {
                    const p1 = getAnchorPos(conn.from.nodeId, 'output');
                    const p2 = getAnchorPos(conn.to.nodeId, 'input');
                    const path = `M ${p1.x} ${p1.y} C ${p1.x + 50} ${p1.y} ${p2.x - 50} ${p2.y} ${p2.x} ${p2.y}`;
                    return <path key={i} d={path} stroke="#67e8f9" strokeWidth="2" fill="none" />;
                })}
                {connecting && canvasRef.current && (() => {
                    const canvasBounds = canvasRef.current.getBoundingClientRect();
                    const p1 = getAnchorPos(connecting.nodeId, connecting.anchorType);
                    const p2 = { x: mousePos.x - canvasBounds.left, y: mousePos.y - canvasBounds.top };
                    const path = connecting.anchorType === 'output'
                        ? `M ${p1.x} ${p1.y} C ${p1.x + 50} ${p1.y} ${p2.x - 50} ${p2.y} ${p2.x} ${p2.y}`
                        : `M ${p2.x} ${p2.y} C ${p2.x + 50} ${p2.y} ${p1.x - 50} ${p1.y} ${p1.x} ${p1.y}`;
                    return <path d={path} stroke="#facc15" strokeWidth="2" strokeDasharray="5,5" fill="none" />;
                })()}
            </svg>

            {nodes.length === 0 && !dragOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <GitBranch className="w-16 h-16 text-white/10 mb-4" />
                    <p className="text-white/40 text-lg">Drag components to the canvas to build your workflow</p>
                </div>
            )}
        </div>
    );
}