import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    Panel,
    useReactFlow,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Option, OptionEditorProps } from './types';

// --- Helper for Colors ---
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

import MathRenderer from '../MathRenderer';

// --- Custom Node Components ---

const RenderImageUploader = ({ data, id }: { data: any, id: string }) => {
    const { mediaUrl, mediaFile, onFileChange, onRemoveMedia } = data;

    // Local handler to wrap the event
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onFileChange) onFileChange(id, e);
    };

    return (
        <div className="space-y-2 mt-2">
            <div className="flex items-start gap-2">
                {(mediaUrl || mediaFile) ? (
                    <div className="relative group">
                        <img
                            src={mediaFile ? URL.createObjectURL(mediaFile) : mediaUrl}
                            alt="Preview"
                            className="h-16 w-auto min-w-[50px] object-contain rounded-md border bg-muted"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemoveMedia(id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <Label htmlFor={`file-${id}`} className="h-10 w-10 flex flex-col items-center justify-center rounded-md border border-dashed bg-muted/30 text-muted-foreground cursor-pointer hover:bg-muted/50">
                        <ImageIcon className="h-4 w-4 opacity-50" />
                    </Label>
                )}

                <Input
                    id={`file-${id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden" // Hiding input, using label to trigger
                />
            </div>
        </div>
    );
};

function LeftEditableNode({ id, data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex flex-col min-h-[80px] bg-card w-[280px] shadow-sm transition-colors",
            data.colorClass as string
        )}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-muted-foreground">Premis</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => data.onDelete(id)}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            <div className="space-y-2">
                <Input
                    value={data.content as string}
                    onChange={(e) => data.onChange(id, e.target.value)}
                    placeholder="Teks premis..."
                    className="h-8 text-xs"
                />

                {(data.content as string) && (
                    <div className="p-2 border rounded bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="text-[10px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">Preview:</div>
                        <MathRenderer content={data.content as string} className="text-xs" />
                    </div>
                )}

                <RenderImageUploader data={data} id={id} />
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-muted-foreground border-2 border-background"
            />
        </div>
    );
}

function RightEditableNode({ id, data }: NodeProps) {
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex flex-col min-h-[80px] bg-card w-[280px] shadow-sm transition-colors",
            data.colorClass as string
        )}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-muted-foreground border-2 border-background"
            />

            <div className="flex items-center gap-2 mb-2 pl-2">
                <span className="text-xs font-bold text-muted-foreground">Respon</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => data.onDelete(id)}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            <div className="space-y-2 text-right">
                <Input
                    value={data.content as string}
                    onChange={(e) => data.onChange(id, e.target.value)}
                    placeholder="Teks respon..."
                    className="h-8 text-xs"
                />

                {(data.content as string) && (
                    <div className="p-2 border rounded bg-slate-50/50 dark:bg-slate-900/50 text-left">
                        <div className="text-[10px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">Preview:</div>
                        <MathRenderer content={data.content as string} className="text-xs" />
                    </div>
                )}

                <div className="flex justify-end">
                    <RenderImageUploader data={data} id={id} />
                </div>
            </div>

            {/* Pair Indicator */}
            {data.pairId && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                    {data.pairId as string}
                </div>
            )}
        </div>
    );
}

const nodeTypes = {
    leftNode: LeftEditableNode,
    rightNode: RightEditableNode,
};

// --- Main Editor Component ---

function MatchingEditorFlow({ options, onChange }: OptionEditorProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // --- Sync Options to Nodes/Edges (Initial Load) ---
    useEffect(() => {
        if (nodes.length > 0 || edges.length > 0) return; // Only load once or if strict sync needed. 
        // Better: Only load if node count doesn't match option count or explicit reset. 
        // For editing, we might need a more robust sync. For now, let's load initially.
        // Actually, if we want to support external updates, we should sync carefully. 
        // But assuming this component owns the state while active.

        const leftOptions = options.filter(o => o.metadata?.side === 'left');
        const rightOptions = options.filter(o => o.metadata?.side === 'right');

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        // Layout
        const startX = 50;
        const rightX = 600;
        const startY = 50;
        const gapY = 150;

        leftOptions.forEach((opt, index) => {
            newNodes.push({
                id: opt.id || `temp-L-${index}`, // Use ID if available, else temp
                type: 'leftNode',
                position: { x: startX, y: startY + (index * gapY) },
                data: {
                    // We need to pass opt data
                    ...opt,
                    // And handlers
                }
            });
        });

        rightOptions.forEach((opt, index) => {
            newNodes.push({
                id: opt.id || `temp-R-${index}`,
                type: 'rightNode',
                position: { x: rightX, y: startY + (index * gapY) },
                data: { ...opt }
            });
        });

        // Edges
        // We find pairs based on metadata.pair_id
        // We need to ensure pair_id matches
        leftOptions.forEach(lOpt => {
            if (lOpt.metadata?.pair_id) {
                const partner = rightOptions.find(r => r.metadata?.pair_id == lOpt.metadata?.pair_id);
                if (partner) {
                    const sourceId = lOpt.id || `temp-L-${leftOptions.indexOf(lOpt)}`;
                    const targetId = partner.id || `temp-R-${rightOptions.indexOf(partner)}`;
                    newEdges.push({
                        id: `e-${sourceId}-${targetId}`,
                        source: sourceId,
                        target: targetId,
                        type: 'default',
                        animated: true,
                        style: { strokeWidth: 2 },
                        markerEnd: { type: MarkerType.ArrowClosed },
                        data: { pairId: lOpt.metadata?.pair_id }
                    });
                }
            }
        });

        setNodes(newNodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                onChange: handleNodeContentChange,
                onFileChange: handleNodeFileChange,
                onRemoveMedia: handleNodeRemoveMedia,
                onDelete: handleNodeDelete,
                colorClass: getPairColor((n.data.metadata as any)?.pair_id)
            }
        })));
        setEdges(newEdges);
    }, []); // Run once on mount. Dependency handling is tricky for 2-way sync without loops.

    // --- Handlers ---

    // 1. Node Content Change
    const handleNodeContentChange = useCallback((id: string, content: string) => {
        setNodes(nds => nds.map(node => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, content } };
            }
            return node;
        }));
        // Update Options Prop
        updateOptionsFromState();
    }, [setNodes]);

    // 2. Node File Change
    const handleNodeFileChange = useCallback((id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setNodes(nds => nds.map(node => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        mediaFile: file,
                        delete_media: false
                    }
                };
            }
            return node;
        }));
        updateOptionsFromState();
    }, [setNodes]);

    // 3. Remove Media
    const handleNodeRemoveMedia = useCallback((id: string) => {
        setNodes(nds => nds.map(node => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        mediaFile: null,
                        mediaUrl: null,
                        media_url: null, // clear both
                        delete_media: true
                    }
                };
            }
            return node;
        }));
        updateOptionsFromState();
    }, [setNodes]);

    // 4. Delete Node
    const handleNodeDelete = useCallback((id: string) => {
        setNodes(nds => nds.filter(n => n.id !== id));
        setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
        // Need to wait for state update to propagate before invoking onChange? 
        // Actually, we should call updateOptionsFromState using the filtered lists.
        // But doing it inside setState callback is hard. 
        // Let's use useEffect to sync state -> options? 
        // No, that might cause loops with props -> state logic.
        // Best approach: Calculate new state, set it, AND call parent.

        // We'll trust the event loop or use a ref, or just re-calculate from current nodes (minus deleted).
        // For simplicity, let's trigger an effect or manually construct.
    }, [setNodes, setEdges]);

    // We need a robust way to push changes up.
    // Let's use a `useEffect` that listens to nodes/edges changes? 
    // IF dependencies are handled well.
    useEffect(() => {
        if (nodes.length === 0 && options.length === 0) return; // Init

        const newOptions: Option[] = nodes.map((node, index) => {
            // Find edges connected to this node
            const connectedEdge = edges.find(e => {
                if (node.type === 'leftNode') return e.source === node.id;
                else return e.target === node.id;
            });

            // Determine Pair ID
            // If connected, edge might have data or just use existing logic.
            // Ideally, we assign pair IDs based on connection order or just sequential?
            // Let's say: each Edge represents a pair. We can assign a unique ID to that edge.

            let pairId = (node.data.metadata as any)?.pair_id;

            // If not connected, clear pairId
            if (!connectedEdge) {
                pairId = undefined;
            } else {
                // If connected, we need a common pairId. 
                // We can use the Edge ID or generate one.
                // Let's use the index of the edge + 1 for simple 1, 2, 3.. visual
                const edgeIndex = edges.indexOf(connectedEdge);
                pairId = edgeIndex + 1;
            }

            return {
                id: node.id.startsWith('temp-') ? undefined : node.id, // Keep ID if real
                question_id: (node.data.question_id as any),
                option_key: (node.type === 'leftNode' ? `L` : `R`) + (index + 1), // Re-assign keys? Or keep?
                // Re-assigning keys L1, L2... R1, R2... based on list order is safer for 'matching' type usually.
                content: (node.data.content as string) || '',
                media_path: (node.data.media_path as string),
                media_url: (node.data.media_url as string), // For preview
                media_file: (node.data.mediaFile as File), // For upload
                delete_media: (node.data.delete_media as boolean),
                is_correct: true, // Matching options usually considered 'parts' of correct answer? Or is_correct logic handles it?
                // In generic Option model, we store parts.
                order: index,
                metadata: {
                    side: node.type === 'leftNode' ? 'left' : 'right',
                    pair_id: pairId,
                }
            };
        });

        // Update nodes color based on NEW pairId
        // This is a side-effect on the nodes state itself (visual update)
        // We shouldn't call setNodes inside this effect if it triggers this effect.
        // But we need the visual update. 
        // We can do it in render/node component. Node receives data. 
        // We passed `colorClass` in data. We need to update that.

        // Let's ONLY call onChange here.
        // For visual updates in ReactFlow, we need to update nodes data.
        // Preventing loop: Only update options if deep different? 

        // Actually, let's rely on the user interactions to trigger specific updates?
        // Drag/Connect -> triggers handleConnect -> updates Edges -> triggers this Effect.

        onChange(newOptions);

    }, [nodes, edges]); // Be careful!

    // Color Update Effect
    useEffect(() => {
        setNodes(nds => nds.map(n => {
            const connectedEdge = edges.find(e =>
                (n.type === 'leftNode' && e.source === n.id) ||
                (n.type === 'rightNode' && e.target === n.id)
            );

            let pairId = undefined;
            if (connectedEdge) {
                pairId = edges.indexOf(connectedEdge) + 1;
            }

            // Only update if changed
            if ((n.data.metadata as any)?.pair_id !== pairId || n.data.pairId !== pairId) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        metadata: { ...(n.data.metadata as any), pair_id: pairId },
                        pairId: pairId,
                        colorClass: getPairColor(pairId)
                    }
                }
            }
            return n;
        }));
    }, [edges]);


    const onConnect = useCallback((params: Connection) => {
        // Only allow Left -> Right
        // ReactFlow handles target/source types if handles are typed? 
        // We can just addEdge.
        // Enforce 1-to-1? If we want strict pairs, yes.
        // If we connect, we should remove existing connections from source or target if 1-to-1.

        setEdges((eds) => {
            // Disable multiple connections for same node?
            // Remove any edge where source is params.source OR target is params.target
            const filtered = eds.filter(e => e.source !== params.source && e.target !== params.target);
            return addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, filtered)
        });
    }, [setEdges]);

    const addLeftNode = () => {
        const id = `temp-L-${Date.now()}`; // Unique Temp ID
        const maxY = nodes.filter(n => n.type === 'leftNode').reduce((max, n) => Math.max(max, n.position.y), 0) || 0;

        const newNode: Node = {
            id,
            type: 'leftNode',
            position: { x: 50, y: maxY + 150 },
            data: {
                content: '',
                metadata: { side: 'left' },
                onChange: handleNodeContentChange,
                onFileChange: handleNodeFileChange,
                onRemoveMedia: handleNodeRemoveMedia,
                onDelete: handleNodeDelete,
                colorClass: getPairColor(null)
            }
        };
        setNodes(nds => [...nds, newNode]);
    };

    const addRightNode = () => {
        const id = `temp-R-${Date.now()}`;
        const maxY = nodes.filter(n => n.type === 'rightNode').reduce((max, n) => Math.max(max, n.position.y), 0) || 0;

        const newNode: Node = {
            id,
            type: 'rightNode',
            position: { x: 600, y: maxY + 150 },
            data: {
                content: '',
                metadata: { side: 'right' },
                onChange: handleNodeContentChange,
                onFileChange: handleNodeFileChange,
                onRemoveMedia: handleNodeRemoveMedia,
                onDelete: handleNodeDelete,
                colorClass: getPairColor(null)
            }
        };
        setNodes(nds => [...nds, newNode]);
    };

    // Update handlers in nodes when they are recreated?
    // We already wrapped them in useEffect [nodes, edges].
    // Wait, the initial useEffect sets the handlers. 
    // New nodes added via addLeftNode need handlers too.

    return (
        <div className="w-full h-[600px] border rounded-xl bg-muted/10 relative group">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                proOptions={{ hideAttribution: true }}
                fitView
            >
                <Background color="#94a3b8" gap={20} size={1} />
                <Controls />
                <Panel position="top-right" className="flex gap-2">
                    <Button onClick={addLeftNode} size="sm" variant="secondary" className="shadow-sm">
                        <Plus className="w-4 h-4 mr-1" /> Add Premis
                    </Button>
                    <Button onClick={addRightNode} size="sm" variant="secondary" className="shadow-sm">
                        <Plus className="w-4 h-4 mr-1" /> Add Respon
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    );
}

// Wrapper to provide Context if needed (ReactFlowProvider)
// Useful if we use useReactFlow hooks inside. 
export default function OptionEditorMatching(props: OptionEditorProps) {
    return (
        <ReactFlowProvider>
            <MatchingEditorFlow {...props} />
        </ReactFlowProvider>
    );
}
