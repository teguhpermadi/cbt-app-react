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
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { OptionViewerProps } from './OptionViewerSingleChoice';
import MathRenderer from '../MathRenderer';

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
                <MathRenderer content={data.content as string} className="text-sm" />
            </div>
            <Handle
                type="source"
                position={Position.Right}
                style={{
                    width: '1.5em',
                    height: '1.5em',
                }}
                className="w-3 h-3 bg-muted-foreground border-2 border-background"
            />
        </div>
    );
}

function RightNode({ data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex flex-col min-h-[80px] bg-white dark:bg-slate-950 w-[280px] shadow-sm",
            // data.colorClass as string // Disabled color for answers
        )}>
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    width: '1.5em',
                    height: '1.5em',
                }}
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
                <MathRenderer content={data.content as string} className="text-sm" />
            </div>
        </div>
    );
}

const nodeTypes = {
    leftNode: LeftNode,
    rightNode: RightNode,
};

function ButtonEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        if (data?.onDelete && typeof data.onDelete === 'function') {
            (data.onDelete as () => void)();
        }
    };

    // Only show button if onDelete is provided (meaning not disabled)
    const showButton = data?.onDelete && !data?.disabled;

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            {showButton && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            fontSize: 12,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        <button
                            className="px-2 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm flex items-center gap-1 border border-white transition-colors text-[10px] font-bold uppercase tracking-wider"
                            onClick={onEdgeClick}
                            type="button"
                            aria-label="Delete connection"
                            title="Hapus Koneksi"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}

const edgeTypes = {
    'button-edge': ButtonEdge,
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

    const deleteConnection = useCallback((sourceId: string) => {
        if (disabled) return;
        const newPairs = { ...value };
        delete newPairs[sourceId];
        onChange(newPairs);
    }, [disabled, value, onChange]);

    // Initialize from options
    useEffect(() => {
        if (!options) return;

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
                    type: 'button-edge',
                    animated: true,
                    style: { strokeWidth: 4 },
                    markerEnd: { type: MarkerType.ArrowClosed },
                    data: {
                        onDelete: () => deleteConnection(leftKey),
                        disabled: disabled
                    }
                });
            }
        });

        setEdges(newEdges);
    }, [options, value, disabled, deleteConnection]);

    const onConnect = useCallback((params: Connection) => {
        if (disabled) return;

        setEdges((eds) => {
            // Remove existing connections from same source
            const filtered = eds.filter(e => e.source !== params.source);
            return addEdge({
                ...params,
                type: 'button-edge',
                animated: true,
                style: { strokeWidth: 4 },
                markerEnd: { type: MarkerType.ArrowClosed },
                data: {
                    onDelete: () => deleteConnection(params.source || ''),
                    disabled: disabled
                }
            }, filtered);
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
                edgeTypes={edgeTypes}
                nodesDraggable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                proOptions={{ hideAttribution: true }}
                fitView
            >
                <Background color="#94a3b8" gap={20} size={1} />
                <Controls showInteractive={false} />
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
