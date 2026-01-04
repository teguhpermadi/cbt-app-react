import React, { useMemo, useEffect } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { AnswerOptionProps } from "../types";
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';

// --- Custom Nodes ---

function LeftOptionNode({ data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex items-center min-h-[100px] bg-card w-[400px] shadow-sm",
            data.colorClass as string
        )}>
            {/* Pair ID Indicator (if showing key) */}
            {data.showKeyAnswer && (
                <span className="mr-2 text-xs font-bold opacity-50 bg-white/50 dark:bg-black/20 px-1 rounded">
                    {data.pairId as string}
                </span>
            )}

            <div className="flex-1 min-w-0">
                <RichTextEditor
                    value={data.content as string}
                    readOnly
                    className="border-0 bg-transparent p-0 min-h-0 text-sm"
                />
                {/* Media Preview */}
                {(data.mediaUrl) && (
                    <div className="mt-2 rounded overflow-hidden border border-border h-24 w-auto bg-white/50 inline-block">
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
                className="w-3 h-3 bg-muted-foreground border-2 border-background"
            />
        </div>
    );
}

function RightOptionNode({ data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex items-center min-h-[100px] bg-card w-[400px] shadow-sm",
            data.colorClass as string
        )}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-muted-foreground border-2 border-background"
            />

            <div className="flex-1 text-right min-w-0">
                <RichTextEditor
                    value={data.content as string}
                    readOnly
                    className="border-0 bg-transparent p-0 min-h-0 text-sm [&_.ProseMirror]:text-right"
                />
                {/* Media Preview */}
                {(data.mediaUrl) && (
                    <div className="mt-2 rounded overflow-hidden border border-border h-24 w-auto bg-white/50 inline-block">
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
                <span className="ml-2 text-xs font-bold opacity-50 bg-white/50 dark:bg-black/20 px-1 rounded">
                    {data.pairId as string}
                </span>
            )}
        </div>
    );
}

// Ensure nodeTypes are defined outside component
const nodeTypes = {
    leftOption: LeftOptionNode,
    rightOption: RightOptionNode,
};

// --- Helper Functions ---
const getPairColor = (pairId: any, showKeyAnswer: boolean) => {
    if (!showKeyAnswer) return "border-border bg-card";

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
};

export default function AnswerOptionsMatching({ options, showKeyAnswer = true }: AnswerOptionProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!options) return;

        const leftOptions = options.filter(o => o.option_key.startsWith('L') || o.metadata?.side === 'left');
        const rightOptions = options.filter(o => o.option_key.startsWith('R') || o.metadata?.side === 'right');

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        // Determine layout
        const startX = 50;
        const rightX = 700; // Increased
        const startY = 50;
        const gapY = 180; // Increased

        // Create Left Nodes
        leftOptions.forEach((opt, index) => {
            newNodes.push({
                id: `l-${opt.id}`,
                type: 'leftOption',
                position: { x: startX, y: startY + (index * gapY) },
                data: {
                    content: opt.content,
                    mediaUrl: opt.media_url || opt.media_path,
                    pairId: opt.metadata?.pair_id,
                    colorClass: getPairColor(opt.metadata?.pair_id, showKeyAnswer),
                    showKeyAnswer,
                },
            });
        });

        // Create Right Nodes
        // We'll place them matching indices for visual alignment usually, 
        // OR preserve their order if they are scrambled. 
        // For 'showKeyAnswer', we might want them slightly scrambled or just listed.
        // Assuming the 'options' array comes in display order.
        rightOptions.forEach((opt, index) => {
            newNodes.push({
                id: `r-${opt.id}`,
                type: 'rightOption',
                position: { x: rightX, y: startY + (index * gapY) },
                data: {
                    content: opt.content,
                    mediaUrl: opt.media_url || opt.media_path,
                    pairId: opt.metadata?.pair_id,
                    colorClass: getPairColor(opt.metadata?.pair_id, showKeyAnswer),
                    showKeyAnswer,
                },
            });

            // Create Edges
            // Iterate all left nodes to find the match
            if (showKeyAnswer) {
                const pairId = opt.metadata?.pair_id;
                const matchingLeft = leftOptions.find(l => l.metadata?.pair_id == pairId);
                if (matchingLeft) {
                    newEdges.push({
                        id: `e-${matchingLeft.id}-${opt.id}`,
                        source: `l-${matchingLeft.id}`,
                        target: `r-${opt.id}`,
                        animated: true,
                        style: { strokeWidth: 2, stroke: '#64748b' }, // Slate-500
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: '#64748b',
                        },
                    });
                }
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [options, showKeyAnswer, setNodes, setEdges]);

    // Calculate canvas height based on number of items
    const maxItems = Math.max(
        options.filter(o => o.option_key.startsWith('L') || o.metadata?.side === 'left').length,
        options.filter(o => o.option_key.startsWith('R') || o.metadata?.side === 'right').length
    );
    const canvasHeight = Math.max(400, (maxItems * 180) + 100);

    return (
        <div
            className="w-full border rounded-xl overflow-hidden bg-muted/10"
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
            >
                <Background color="#94a3b8" gap={20} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    );
}
