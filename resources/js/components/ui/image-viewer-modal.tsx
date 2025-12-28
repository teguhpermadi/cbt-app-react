import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';

interface ImageViewerModalProps {
    src: string;
    alt?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewerModal({ src, alt = 'Image', isOpen, onClose }: ImageViewerModalProps) {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);
    const handleReset = () => {
        setZoom(100);
        setRotation(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
                <div className="relative w-full h-full flex flex-col bg-slate-100 dark:bg-slate-900">
                    {/* Controls */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2">
                        <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm self-center min-w-[60px] text-center font-medium">{zoom}%</span>
                        <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 300}>
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <div className="w-px bg-slate-200 dark:bg-slate-700" />
                        <Button variant="ghost" size="icon" onClick={handleRotate}>
                            <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>

                    {/* Image Container */}
                    <div className="flex-1 overflow-auto flex items-center justify-center p-8">
                        <img
                            src={src}
                            alt={alt}
                            style={{
                                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out',
                            }}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
