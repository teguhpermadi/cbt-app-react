import React, { useCallback, useEffect, useState } from 'react';
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
    Connection,
    addEdge,
    Edge,
    Node,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { OptionViewerProps } from './OptionViewerSingleChoice';

// Custom Node Components for read-only matching display
function LeftNode({ data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex flex-col min-h-[80px] bg-card w-[280px] shadow-sm",
            data.colorClass as string
        )}>
            <div className="text-xs font-bold text-muted-foreground mb-2">Premis</div>
            <div className="space-y-2">
                {data.mediaUrl && (
                    <img
                        src={data.mediaUrl as string}
                        alt="Premise"
                        className="h-16 w-auto rounded-md border object-contain"
                    />
                )}
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: data.content as string }} />
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-muted-foreground border-2 border-background"
            />
        </div>
    );
}

function RightNode({ data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex flex-col min-h-[80px] bg-card w-[280px] shadow-sm",
            data.colorClass as string
        )}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-muted-foreground border-2 border-background"
            />
            <div className="text-xs font-bold text-muted-foreground mb-2">Respon</div>
            <div className="space-y-2">
                {data.mediaUrl && (
                    <img
                        src={data.mediaUrl as string}
                        alt="Response"
                        className="h-16 w-auto rounded-md border object-contain"
                    />
                )}
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: data.content as string }} />
            </div>
            {data.pairId && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                    {data.pairId as string}
                </div>
            )}
        </div>
    );
}

const nodeTypes = {
    leftNode: LeftNode,
    rightNode: RightNode,
};

// Helper for Colors
const getPairColor = (pairId: any) => {
    if (!pairId) return "border-border bg-card";
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

function MatchingFlow({ options, value, onChange, disabled }: OptionViewerProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Initialize from options
    useEffect(() => {
        if (!options) return;

        console.log('Matching options:', options); // DEBUG

        // Check if options have metadata.side, otherwise split by key pattern (L1, R1, etc)
        const leftOptions = Object.entries(options).filter(([key, opt]: [string, any]) => {
            return opt.metadata?.side === 'left' || key.startsWith('L');
        });
        const rightOptions = Object.entries(options).filter(([key, opt]: [string, any]) => {
            return opt.metadata?.side === 'right' || key.startsWith('R');
        });

        const newNodes: Node[] = [];
        const startX = 50;
        const rightX = 600;
        const startY = 50;
        const gapY = 150;

        leftOptions.forEach(([key, opt]: [string, any], index) => {
            newNodes.push({
                id: key,
                type: 'leftNode',
                position: { x: startX, y: startY + (index * gapY) },
                data: {
                    content: opt.content || '',
                    mediaUrl: opt.media_url || opt.media,
                    colorClass: getPairColor(opt.metadata?.pair_id || opt.pair_id)
                }
            });
        });

        rightOptions.forEach(([key, opt]: [string, any], index) => {
            newNodes.push({
                id: key,
                type: 'rightNode',
                position: { x: rightX, y: startY + (index * gapY) },
                data: {
                    content: opt.content || '',
                    mediaUrl: opt.media_url || opt.media,
                    pairId: opt.metadata?.pair_id || opt.pair_id,
                    colorClass: getPairColor(opt.metadata?.pair_id || opt.pair_id)
                }
            });
        });

        setNodes(newNodes);

        // Build edges from current answer (value)
        const currentPairs = value || {};
        const newEdges: Edge[] = [];

        Object.entries(currentPairs).forEach(([leftKey, rightKey]: [string, any]) => {
            if (rightKey) {
                newEdges.push({
                    id: `e-${leftKey}-${rightKey}`,
                    source: leftKey,
                    target: rightKey,
                    type: 'default',
                    animated: true,
                    style: { strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed },
                });
            }
        });

        setEdges(newEdges);
    }, [options, value]);

    const onConnect = useCallback((params: Connection) => {
        if (disabled) return;

        setEdges((eds) => {
            // Remove existing connections from same source
            const filtered = eds.filter(e => e.source !== params.source);
            return addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, filtered);
        });

        // Update answer value
        const newPairs = { ...value };
        if (params.source && params.target) {
            newPairs[params.source] = params.target;
        }
        onChange(newPairs);
    }, [disabled, value, onChange]);

    return (
        <div className="w-full h-[600px] border rounded-xl bg-muted/10 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                proOptions={{ hideAttribution: true }}
                fitView
            >
                <Background color="#94a3b8" gap={20} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default function OptionViewerMatching(props: OptionViewerProps) {
    return (
        <ReactFlowProvider>
            <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Hubungkan premis di sebelah kiri dengan respon yang sesuai di sebelah kanan:
                </p>
                <MatchingFlow {...props} />
            </div>
        </ReactFlowProvider>
    );
}
