import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    MarkerType,
    NodeProps,
    Edge,
    Node,
    addEdge,
    Connection,
    ReactFlowProvider,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { AnswerOptionProps, Option } from "../types";
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';

// --- Types ---
interface ExtendedAnswerOptionProps extends AnswerOptionProps {
    onAnswerChange?: (options: Option[]) => void;
    isReadOnly?: boolean;
}

// --- Custom Nodes ---

// Helper to determine if a node is selected
const isNodeSelected = (id: string, selectedId: string | null) => id === selectedId;

function LeftOptionNode({ id, data }: NodeProps) {
    const isSelected = data.isSelected as boolean;
    const isConnected = data.isConnected as boolean;

    return (
        <div
            className={cn(
                "relative p-3 rounded-lg border-2 text-sm flex items-center min-h-[100px] bg-card w-[400px] shadow-sm transition-all duration-200 cursor-pointer select-none",
                data.colorClass as string,
                isSelected ? "ring-2 ring-primary border-primary shadow-md" : "",
                !isSelected && isConnected ? "border-muted-foreground/50" : ""
            )}
            onClick={(e) => {
                if (data.onNodeClick) {
                    (data.onNodeClick as Function)(e, id, 'left');
                }
            }}
        >
            {/* Full size handle overlay */}
            {!data.isReadOnly && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 rounded-lg cursor-pointer"
                    id="source"
                />
            )}

            {/* Visual content */}
            <div className="flex-1 min-w-0 pointer-events-none">
                {/* Pair ID Indicator (if showing key) */}
                {data.showKeyAnswer && (
                    <span className="mr-2 text-xs font-bold opacity-50 bg-white/50 dark:bg-black/20 px-1 rounded inline-block mb-1">
                        {data.pairId as string}
                    </span>
                )}

                <RichTextEditor
                    value={data.content as string}
                    readOnly
                    className="border-0 bg-transparent p-0 min-h-0 text-sm"
                />

                {data.mediaUrl && (
                    <div className="mt-2 rounded overflow-hidden border border-border h-24 w-auto bg-white/50 inline-block relative z-20">
                        <img
                            src={data.mediaUrl as string}
                            alt="Visual"
                            className="h-full w-auto object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Visual Handle Dot (Inactive for hit test but visible) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-muted-foreground border-2 border-background rounded-full z-0 pointer-events-none" />
        </div>
    );
}

function RightOptionNode({ id, data }: NodeProps) {
    const isSelected = data.isSelected as boolean;
    const isConnected = data.isConnected as boolean;

    return (
        <div
            className={cn(
                "relative p-3 rounded-lg border-2 text-sm flex items-center min-h-[100px] bg-card w-[400px] shadow-sm transition-all duration-200 cursor-pointer select-none",
                data.colorClass as string,
                isSelected ? "ring-2 ring-primary border-primary shadow-md" : "",
                !isSelected && isConnected ? "border-muted-foreground/50" : ""
            )}
            onClick={(e) => {
                if (data.onNodeClick) {
                    (data.onNodeClick as Function)(e, id, 'right');
                }
            }}
        >
            {/* Full size handle overlay */}
            {!data.isReadOnly && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 rounded-lg cursor-pointer"
                    id="target"
                />
            )}

            {/* Visual Handle Dot */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-muted-foreground border-2 border-background rounded-full z-0 pointer-events-none" />

            {/* Visual content */}
            <div className="flex-1 text-right min-w-0 pointer-events-none">
                <RichTextEditor
                    value={data.content as string}
                    readOnly
                    className="border-0 bg-transparent p-0 min-h-0 text-sm [&_.ProseMirror]:text-right"
                />

                {data.mediaUrl && (
                    <div className="mt-2 rounded overflow-hidden border border-border h-24 w-auto bg-white/50 inline-block relative z-20">
                        <img
                            src={data.mediaUrl as string}
                            alt="Visual"
                            className="h-full w-auto object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Pair ID Indicator (if showing key) */}
            {data.showKeyAnswer && (
                <span className="ml-2 text-xs font-bold opacity-50 bg-white/50 dark:bg-black/20 px-1 rounded inline-block mb-1">
                    {data.pairId as string}
                </span>
            )}
        </div>
    );
}

const nodeTypes = {
    leftOption: LeftOptionNode,
    rightOption: RightOptionNode,
};

// --- Helper Functions ---
const getPairColor = (pairId: any, showKeyAnswer: boolean, isConnected: boolean = false) => {
    // If showing key answer, use pair colors
    if (showKeyAnswer && pairId) {
        const colors = [
            "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
            "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
            "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
            "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
            "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30",
            "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30",
        ];
        const id = typeof pairId === 'number' ? pairId : parseInt(pairId) || 0;
        return colors[(id - 1) % colors.length];
    }

    // If student mode AND connected, show a distinct active color (e.g., blueish)
    if (isConnected) {
        return "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20";
    }

    // Default neutral
    return "border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 transition-colors";
};

// --- Main Flow Component ---

function MatchingFlow({ options, showKeyAnswer = false, onAnswerChange, isReadOnly = false }: ExtendedAnswerOptionProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    // Track selected node for click-to-connect interaction
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const { fitView } = useReactFlow();

    // Initialize Nodes & Edges from Options
    useEffect(() => {
        if (!options) return;

        const leftOptions = options.filter(o => o.option_key.startsWith('L') || o.metadata?.side === 'left');
        const rightOptions = options.filter(o => o.option_key.startsWith('R') || o.metadata?.side === 'right');

        // Layout constants
        const startX = 50;
        const rightX = 700;
        const startY = 50;
        const gapY = 180;

        // Build edges based on metadata
        const currentEdges: Edge[] = [];

        // Helper to find pairs
        leftOptions.forEach(lOpt => {
            const pairId = lOpt.metadata?.pair_id;
            if (pairId) {
                // Find right option with same pairId
                const rOpt = rightOptions.find(r => r.metadata?.pair_id == pairId);
                if (rOpt) {
                    currentEdges.push({
                        id: `e-l-${lOpt.id}-r-${rOpt.id}`,
                        source: `l-${lOpt.id}`,
                        target: `r-${rOpt.id}`,
                        sourceHandle: 'source',
                        targetHandle: 'target',
                        animated: !showKeyAnswer, // Animate for student answers
                        style: {
                            strokeWidth: showKeyAnswer ? 3 : 2,
                            stroke: showKeyAnswer ? '#22c55e' : '#3b82f6'
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: showKeyAnswer ? '#22c55e' : '#3b82f6',
                        },
                    });
                }
            }
        });

        setEdges(currentEdges);

    }, [options, showKeyAnswer, setEdges]);
    // Note: We deliberately exclude 'options' from deep re-runs if only references change, but here usage is fine.

    // Update nodes state
    useEffect(() => {
        const leftOptions = options.filter(o => o.option_key.startsWith('L') || o.metadata?.side === 'left');
        const rightOptions = options.filter(o => o.option_key.startsWith('R') || o.metadata?.side === 'right');
        const startX = 50;
        const rightX = 700;
        const startY = 50;
        const gapY = 180;

        const builtNodes: Node[] = [];

        // Helper to check connection status
        const checkConnected = (id: string, type: 'source' | 'target') => {
            return edges.some(e => type === 'source' ? e.source === id : e.target === id);
        };

        const effectiveReadOnly = isReadOnly || showKeyAnswer;

        // Left Nodes
        leftOptions.forEach((opt, index) => {
            const nodeId = `l-${opt.id}`;
            const isConnected = checkConnected(nodeId, 'source');

            builtNodes.push({
                id: nodeId,
                type: 'leftOption',
                position: { x: startX, y: startY + (index * gapY) },
                draggable: false, // Lock position
                data: {
                    content: opt.content,
                    mediaUrl: opt.media_url || opt.media_path,
                    pairId: opt.metadata?.pair_id,
                    colorClass: getPairColor(opt.metadata?.pair_id, showKeyAnswer, isConnected),
                    showKeyAnswer,
                    isReadOnly: effectiveReadOnly,
                    isSelected: selectedNodeId === nodeId,
                    isConnected,
                    onNodeClick: handleNodeClick,
                },
            });
        });

        // Right Nodes
        rightOptions.forEach((opt, index) => {
            const nodeId = `r-${opt.id}`;
            const isConnected = checkConnected(nodeId, 'target');

            builtNodes.push({
                id: nodeId,
                type: 'rightOption',
                position: { x: rightX, y: startY + (index * gapY) },
                draggable: false, // Lock position
                data: {
                    content: opt.content,
                    mediaUrl: opt.media_url || opt.media_path,
                    pairId: opt.metadata?.pair_id,
                    colorClass: getPairColor(opt.metadata?.pair_id, showKeyAnswer, isConnected),
                    showKeyAnswer,
                    isReadOnly: effectiveReadOnly,
                    isSelected: selectedNodeId === nodeId,
                    isConnected,
                    onNodeClick: handleNodeClick,
                },
            });
        });

        setNodes(builtNodes);
    }, [options, showKeyAnswer, edges, selectedNodeId, isReadOnly]);


    // --- Interaction Handlers ---

    // Click-to-Connect Logic
    const handleNodeClick = useCallback((e: React.MouseEvent, nodeId: string, side: 'left' | 'right') => {
        if (isReadOnly || showKeyAnswer) return;
        e.stopPropagation(); // Prevent canvas click

        setSelectedNodeId((prev) => {
            // If clicking the same node, deselect
            if (prev === nodeId) return null;

            // If nothing selected, select this one
            if (!prev) return nodeId;

            // If connection attempt (Right -> Left or Left -> Right)
            const isPrevLeft = prev.startsWith('l-');
            const isCurrentLeft = nodeId.startsWith('l-');

            // If same side, just switch selection
            if (isPrevLeft === isCurrentLeft) return nodeId;

            // Valid pair! Create edge.
            const pSource = isPrevLeft ? prev : nodeId;
            const pTarget = isPrevLeft ? nodeId : prev;

            createConnection(pSource, pTarget);
            return null; // Clear selection after connect
        });
    }, [selectedNodeId, isReadOnly, showKeyAnswer]);

    // Create Connection
    const createConnection = (sourceId: string, targetId: string) => {
        const newEdge: Edge = {
            id: `e-${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            sourceHandle: 'source',
            targetHandle: 'target',
            animated: true,
            style: { strokeWidth: 2, stroke: '#3b82f6' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        };

        setEdges((eds) => {
            // Remove any existing edge starting from source OR ending at target (Enforce 1:1)
            const filtered = eds.filter(e => e.source !== sourceId && e.target !== targetId);
            return addEdge(newEdge, filtered);
        });
    };

    // ReactFlow Drag Connect Handler
    const onConnect = useCallback((params: Connection) => {
        if (isReadOnly || showKeyAnswer) return;
        setEdges((eds) => {
            const filtered = eds.filter(e => e.source !== params.source && e.target !== params.target);
            return addEdge({
                ...params,
                animated: true,
                style: { strokeWidth: 2, stroke: '#3b82f6' },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
            }, filtered);
        });
        setSelectedNodeId(null);
    }, [setEdges, isReadOnly, showKeyAnswer]);

    // Edge Click to Delete
    const onEdgeClick = useCallback((e: React.MouseEvent, edge: Edge) => {
        if (isReadOnly || showKeyAnswer) return;
        setEdges((eds) => eds.filter(ed => ed.id !== edge.id));
    }, [isReadOnly, showKeyAnswer]);

    // Update parent with new answers whenever edges change
    useEffect(() => {
        if (showKeyAnswer || !onAnswerChange) return;

        // Map edges back to options
        const pairMap = new Map<string, number>();

        edges.forEach((edge, index) => {
            const leftId = edge.source.replace('l-', '');
            const rightId = edge.target.replace('r-', '');
            const stablePairId = index + 1;

            pairMap.set(leftId, stablePairId);
            pairMap.set(rightId, stablePairId);
        });

        // We need to construct a new options array with updated metadata
        // We only trigger if it's different to avoid loops

        // This logic requires stable options, so we map the *original* options prop
        const currentOptionPairs = options.map(o => o.metadata?.pair_id);
        const newOptionPairs = options.map(o => pairMap.get(o.id));

        const isDifferent = currentOptionPairs.some((pid, i) => pid !== newOptionPairs[i]);

        if (isDifferent) {
            const newOptions = options.map(opt => ({
                ...opt,
                metadata: {
                    ...opt.metadata,
                    pair_id: pairMap.get(opt.id)
                }
            }));
            onAnswerChange(newOptions);
        }

    }, [edges, onAnswerChange]); // Depend on edges, options is implicitly there but we act on edges change

    // Canvas Height
    const maxItems = Math.max(
        options.filter(o => o.option_key.startsWith('L') || o.metadata?.side === 'left').length,
        options.filter(o => o.option_key.startsWith('R') || o.metadata?.side === 'right').length
    );
    const canvasHeight = Math.max(400, (maxItems * 180) + 100);

    return (
        <div
            className="w-full border rounded-xl overflow-hidden bg-muted/10 relative"
            style={{ height: `${canvasHeight}px` }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeClick={onEdgeClick}
                onPaneClick={() => setSelectedNodeId(null)}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                panOnDrag={true} // Enabled panning
                panOnScroll={true}
                zoomOnScroll={false}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#94a3b8" gap={20} size={1} />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
}

export default function AnswerOptionsMatching(props: ExtendedAnswerOptionProps) {
    return (
        <ReactFlowProvider>
            <MatchingFlow {...props} />
        </ReactFlowProvider>
    );
}
