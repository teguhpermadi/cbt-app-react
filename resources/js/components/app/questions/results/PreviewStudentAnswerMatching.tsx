import React, { useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    MarkerType,
    NodeProps,
    Edge,
    Node,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import MathRenderer from '../MathRenderer';

interface Option {
    id: string;
    key: string;
    content: string;
    media_url?: string | null;
    media?: string | null;
    side?: string;
    pair_id?: any;
    // Add extra fields that might come from the API
    [key: string]: any;
}

interface MatchingResultProps {
    options: Record<string, Option>;
    studentAnswer?: Record<string, string> | null;
    keyAnswer?: { pairs: Record<string, string> } | null;
    showMedia?: boolean;
    showStudentAnswer?: boolean;
    showKeyAnswer?: boolean;
}

// --- Custom Nodes ---

function LeftOptionNode({ data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-xl border text-sm flex items-center min-h-[60px] bg-card w-[350px] shadow-sm transition-all hover:shadow-md",
            data.colorClass as string
        )}>
            <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                        {data.label as string}
                    </span>
                </div>

                <MathRenderer content={data.content as string} className="text-sm" />

                {data.mediaUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border h-16 w-auto bg-muted/20 inline-block">
                        <img
                            src={data.mediaUrl as string}
                            alt="Visual"
                            className="h-full w-auto object-contain"
                        />
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-muted-foreground border-2 border-background ring-2 ring-primary/10 transition-all hover:ring-primary/30 hover:scale-110 !-right-1.5"
            />
        </div>
    );
}

function RightOptionNode({ data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-xl border text-sm flex items-center min-h-[60px] bg-card w-[350px] shadow-sm transition-all hover:shadow-md",
            data.colorClass as string
        )}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-muted-foreground border-2 border-background ring-2 ring-primary/10 transition-all hover:ring-primary/30 hover:scale-110 !-left-1.5"
            />

            <div className="flex-1 min-w-0 pl-4 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                        {data.label as string}
                    </span>
                </div>

                <MathRenderer content={data.content as string} className="text-sm" />

                {data.mediaUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border h-16 w-auto bg-muted/20 inline-block">
                        <img
                            src={data.mediaUrl as string}
                            alt="Visual"
                            className="h-full w-auto object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

const nodeTypes = {
    leftOption: LeftOptionNode,
    rightOption: RightOptionNode,
};

export default function PreviewStudentAnswerMatching({
    options,
    studentAnswer,
    keyAnswer,
    showMedia = true,
    showStudentAnswer = true,
    showKeyAnswer = true
}: MatchingResultProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!options) return;

        const leftOptionsList = Object.values(options)
            .filter(o => o.key.startsWith('L') || o.side === 'left')
            .sort((a, b) => a.key.localeCompare(b.key));

        const rightOptionsList = Object.values(options)
            .filter(o => o.key.startsWith('R') || o.side === 'right')
            .sort((a, b) => a.key.localeCompare(b.key));

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        // Layout Config
        const startX = 20;
        const rightX = 600; // Increased distance for better visibility
        const startY = 20;
        const gapY = 150; // More vertical space

        // Create Left Nodes
        leftOptionsList.forEach((opt, index) => {
            newNodes.push({
                id: opt.key, // Use key as ID for easier mapping
                type: 'leftOption',
                position: { x: startX, y: startY + (index * gapY) },
                data: {
                    label: opt.key,
                    content: opt.content,
                    mediaUrl: showMedia ? (opt.media_url || opt.media) : null,
                    pairId: opt.pair_id,
                },
                draggable: false,
                selectable: false,
            });
        });

        // Create Right Nodes
        rightOptionsList.forEach((opt, index) => {
            newNodes.push({
                id: opt.key,
                type: 'rightOption',
                position: { x: rightX, y: startY + (index * gapY) },
                data: {
                    label: opt.key,
                    content: opt.content,
                    mediaUrl: showMedia ? (opt.media_url || opt.media) : null,
                    pairId: opt.pair_id,
                },
                draggable: false,
                selectable: false,
            });
        });

        // 1. Draw Key Answers (Dashed Lines)
        if (showKeyAnswer && keyAnswer?.pairs) {
            Object.entries(keyAnswer.pairs).forEach(([leftKey, rightKey]) => {
                // Ensure nodes exist (basic validation)
                if (options[leftKey] && options[rightKey]) {
                    newEdges.push({
                        id: `key-${leftKey}-${rightKey}`,
                        source: leftKey,
                        target: rightKey,
                        animated: false,
                        style: {
                            stroke: '#10b981', // Emerald-500
                            strokeWidth: 2,
                            strokeDasharray: '5,5',
                            opacity: 0.6
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: '#10b981',
                        },
                        zIndex: 1, // Lower z-index than student answer
                    });
                }
            });
        }

        // 2. Draw Student Answers (Solid Lines)
        if (showStudentAnswer && studentAnswer) {
            Object.entries(studentAnswer).forEach(([leftKey, rightKey]) => {
                if (options[leftKey] && options[rightKey]) {
                    // Check Correctness
                    const isCorrect = keyAnswer?.pairs?.[leftKey] === rightKey;
                    const color = isCorrect ? '#059669' : '#dc2626'; // Emerald-600 vs Red-600

                    newEdges.push({
                        id: `student-${leftKey}-${rightKey}`,
                        source: leftKey,
                        target: rightKey,
                        animated: false,
                        style: {
                            stroke: color,
                            strokeWidth: 3,
                            strokeDasharray: '0',
                        },
                        zIndex: 10, // Top z-index
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: color,
                        },
                    });
                }
            });
        }

        setNodes(newNodes);
        setEdges(newEdges);
    }, [options, studentAnswer, keyAnswer, showMedia, showKeyAnswer, showStudentAnswer, setNodes, setEdges]);

    // Calculate dynamic height
    const maxItems = Math.max(
        Object.values(options).filter(o => o.key.startsWith('L') || o.side === 'left').length,
        Object.values(options).filter(o => o.key.startsWith('R') || o.side === 'right').length
    );
    const canvasHeight = Math.max(400, (maxItems * 150) + 100);

    return (
        <div
            className="w-full border rounded-xl overflow-hidden bg-muted/5"
            style={{ height: `${canvasHeight}px` }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
                panOnDrag={true} // Allow panning for better view
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                // Prevent user interaction modifying structure
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
            >
                <Background color="#94a3b8" gap={24} size={1} />
                <Panel position="bottom-center" className="bg-card/90 backdrop-blur-sm p-3 rounded-lg border shadow-sm text-xs flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-[#059669]"></div>
                        <span className="font-medium">Jawaban Benar (Siswa)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-[#dc2626]"></div>
                        <span className="font-medium">Jawaban Salah (Siswa)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 border-t-2 border-dashed border-[#10b981]"></div>
                        <span className="font-medium">Kunci Jawaban</span>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}
