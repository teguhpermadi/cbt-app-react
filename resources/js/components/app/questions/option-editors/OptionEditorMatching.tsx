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
    Panel,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { Image as ImageIcon, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Option, OptionEditorProps } from './types';
import RichTextEditor from '@/components/ui/rich-text/RichTextEditor';

// --- Type Definitions ---
interface EditableNodeData extends Record<string, unknown> {
    content: string;
    mediaUrl?: string | null;
    mediaFile?: File | null;
    media_url?: string | null;
    media_path?: string;
    delete_media?: boolean;
    pairId?: any;
    colorClass?: string;
    onChange: (id: string, content: string) => void;
    onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveMedia: (id: string) => void;
    onDelete: (id: string) => void;
    metadata?: {
        side?: 'left' | 'right';
        pair_id?: any;
    };
    question_id?: any;
}

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

// --- Custom Node Components ---

const RenderImageUploader = ({ data, id }: { data: EditableNodeData, id: string }) => {
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
                            src={mediaFile ? URL.createObjectURL(mediaFile) : (mediaUrl || "")}
                            alt="Preview"
                            className="h-20 w-auto min-w-[50px] object-contain rounded-md border bg-muted"
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
                    <Label htmlFor={`file-${id}`} className="h-9 w-24 flex items-center justify-center rounded-md border bg-muted/30 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 gap-1">
                        <ImageIcon className="h-3 w-3" />
                        Image
                    </Label>
                )}

                <input
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
    const nodeData = data as EditableNodeData;
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex flex-col min-h-[150px] bg-card w-[400px] shadow-sm transition-colors",
            nodeData.colorClass
        )}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-muted-foreground">Premis</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => nodeData.onDelete(id)}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            <div className="space-y-2 flex-1">
                <RichTextEditor
                    value={nodeData.content || ''}
                    onChange={(val) => nodeData.onChange(id, val)}
                    placeholder="Teks premis..."
                    className="min-h-[100px]"
                />

                <RenderImageUploader data={nodeData} id={id} />
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-muted-foreground border-2 border-background transform translate-x-1/2"
            />
        </div>
    );
}

function RightEditableNode({ id, data }: NodeProps) {
    const nodeData = data as EditableNodeData;
    return (
        <div className={cn(
            "relative p-3 rounded-lg border-2 text-sm flex flex-col min-h-[150px] bg-card w-[400px] shadow-sm transition-colors",
            nodeData.colorClass
        )}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-muted-foreground border-2 border-background transform -translate-x-1/2"
            />

            <div className="flex items-center gap-2 mb-2 pl-2">
                <span className="text-xs font-bold text-muted-foreground">Respon</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => nodeData.onDelete(id)}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            <div className="space-y-2 flex-1 relative">
                <RichTextEditor
                    value={nodeData.content || ''}
                    onChange={(val) => nodeData.onChange(id, val)}
                    placeholder="Teks respon..."
                    className="min-h-[100px]"
                />

                <div className="flex justify-end mt-2">
                    <RenderImageUploader data={nodeData} id={id} />
                </div>
            </div>

            {/* Pair Indicator */}
            {nodeData.pairId && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm z-10">
                    {nodeData.pairId as string}
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
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<EditableNodeData>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // --- Sync Options to Nodes/Edges (Initial Load) ---
    useEffect(() => {
        if (nodes.length > 0 || edges.length > 0) return;

        const leftOptions = options.filter(o => o.metadata?.side === 'left');
        const rightOptions = options.filter(o => o.metadata?.side === 'right');

        const newNodes: Node<EditableNodeData>[] = [];
        const newEdges: Edge[] = [];

        // Layout
        const startX = 50;
        const rightX = 700; // Increased
        const startY = 50;
        const gapY = 300; // Increased significantly for RichTextEditor

        leftOptions.forEach((opt, index) => {
            newNodes.push({
                id: opt.id || `temp-L-${index}`,
                type: 'leftNode',
                position: { x: startX, y: startY + (index * gapY) },
                data: {
                    ...opt,
                    // Ensure all required fields of EditableNodeData are present or placeholder
                    // Handlers are attached later, but for type safety here:
                    content: opt.content || '',
                    onChange: () => { },
                    onFileChange: () => { },
                    onRemoveMedia: () => { },
                    onDelete: () => { },
                    colorClass: getPairColor(opt.metadata?.pair_id)
                } as EditableNodeData
            });
        });

        rightOptions.forEach((opt, index) => {
            newNodes.push({
                id: opt.id || `temp-R-${index}`,
                type: 'rightNode',
                position: { x: rightX, y: startY + (index * gapY) },
                data: {
                    ...opt,
                    content: opt.content || '',
                    onChange: () => { },
                    onFileChange: () => { },
                    onRemoveMedia: () => { },
                    onDelete: () => { },
                    colorClass: getPairColor(opt.metadata?.pair_id)
                } as EditableNodeData
            });
        });

        // Edges
        // We find pairs based on metadata.pair_id
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

        // Attach actual handlers
        setNodes(newNodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                onChange: handleNodeContentChange,
                onFileChange: handleNodeFileChange,
                onRemoveMedia: handleNodeRemoveMedia,
                onDelete: handleNodeDelete,
                colorClass: getPairColor((n.data as EditableNodeData).metadata?.pair_id)
            }
        })));
        setEdges(newEdges);
    }, []); // Run once on mount

    // --- Handlers ---

    // 1. Node Content Change
    const handleNodeContentChange = useCallback((id: string, content: string) => {
        setNodes(nds => nds.map(node => {
            if (node.id === id) {
                return { ...node, data: { ...(node.data as EditableNodeData), content } };
            }
            return node;
        }));
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
                        ...(node.data as EditableNodeData),
                        mediaFile: file,
                        delete_media: false
                    }
                };
            }
            return node;
        }));
    }, [setNodes]);

    // 3. Remove Media
    const handleNodeRemoveMedia = useCallback((id: string) => {
        setNodes(nds => nds.map(node => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...(node.data as EditableNodeData),
                        mediaFile: null,
                        mediaUrl: null,
                        media_url: null, // clear both
                        delete_media: true
                    }
                };
            }
            return node;
        }));
    }, [setNodes]);

    // 4. Delete Node
    const handleNodeDelete = useCallback((id: string) => {
        setNodes(nds => nds.filter(n => n.id !== id));
        setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    }, [setNodes, setEdges]);

    // Effect to sync options up
    useEffect(() => {
        if (nodes.length === 0 && options.length === 0) return; // Init

        const newOptions: Option[] = nodes.map((node, index) => {
            // Find edges connected to this node
            const connectedEdge = edges.find(e => {
                if (node.type === 'leftNode') return e.source === node.id;
                else return e.target === node.id;
            });

            const nodeData = node.data as EditableNodeData;
            let pairId = nodeData.metadata?.pair_id;

            // If not connected, clear pairId
            if (!connectedEdge) {
                pairId = undefined;
            } else {
                // Let's use the index of the edge + 1 for simple 1, 2, 3.. visual
                const edgeIndex = edges.indexOf(connectedEdge);
                pairId = edgeIndex + 1;
            }

            return {
                id: node.id.startsWith('temp-') ? undefined : node.id, // Keep ID if real
                question_id: nodeData.question_id,
                option_key: (node.type === 'leftNode' ? `L` : `R`) + (index + 1),
                content: (nodeData.content as string) || '',
                media_path: (nodeData.media_path as string),
                media_url: (nodeData.media_url as string), // For preview
                media_file: (nodeData.mediaFile as File), // For upload
                delete_media: (nodeData.delete_media as boolean),
                is_correct: true,
                order: index,
                metadata: {
                    side: node.type === 'leftNode' ? 'left' : 'right',
                    pair_id: pairId,
                }
            };
        });

        onChange(newOptions);

    }, [nodes, edges]);

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

            const data = n.data as EditableNodeData;

            // Only update if changed
            if (data.metadata?.pair_id !== pairId || data.pairId !== pairId) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        metadata: { ...data.metadata, pair_id: pairId },
                        pairId: pairId,
                        colorClass: getPairColor(pairId)
                    }
                }
            }
            return n;
        }));
    }, [edges]);


    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => {
            const filtered = eds.filter(e => e.source !== params.source && e.target !== params.target);
            return addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, filtered)
        });
    }, [setEdges]);

    const addLeftNode = () => {
        const id = `temp-L-${Date.now()}`;
        const maxY = nodes.filter(n => n.type === 'leftNode').reduce((max, n) => Math.max(max, n.position.y), 0) || 0;

        const newNode: Node<EditableNodeData> = {
            id,
            type: 'leftNode',
            position: { x: 50, y: maxY + 300 },
            data: {
                content: '',
                metadata: { side: 'left' },
                onChange: handleNodeContentChange,
                onFileChange: handleNodeFileChange,
                onRemoveMedia: handleNodeRemoveMedia,
                onDelete: handleNodeDelete,
                colorClass: getPairColor(null)
            } as EditableNodeData
        };
        setNodes(nds => [...nds, newNode]);
    };

    const addRightNode = () => {
        const id = `temp-R-${Date.now()}`;
        const maxY = nodes.filter(n => n.type === 'rightNode').reduce((max, n) => Math.max(max, n.position.y), 0) || 0;

        const newNode: Node<EditableNodeData> = {
            id,
            type: 'rightNode',
            position: { x: 700, y: maxY + 300 },
            data: {
                content: '',
                metadata: { side: 'right' },
                onChange: handleNodeContentChange,
                onFileChange: handleNodeFileChange,
                onRemoveMedia: handleNodeRemoveMedia,
                onDelete: handleNodeDelete,
                colorClass: getPairColor(null)
            } as EditableNodeData
        };
        setNodes(nds => [...nds, newNode]);
    };

    const maxItems = Math.max(
        nodes.filter(n => n.type === 'leftNode').length,
        nodes.filter(n => n.type === 'rightNode').length
    );
    const canvasHeight = Math.max(600, (maxItems * 300) + 100);

    return (
        <div className="w-full border rounded-xl bg-muted/10 relative group" style={{ height: `${canvasHeight}px` }}>
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

export default function OptionEditorMatching(props: OptionEditorProps) {
    return (
        <ReactFlowProvider>
            <MatchingEditorFlow {...props} />
        </ReactFlowProvider>
    );
}
