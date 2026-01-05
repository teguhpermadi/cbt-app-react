import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'; // Added DialogTitle for accessibility
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, X, RefreshCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageViewerModalProps {
    src: string;
    alt?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewerModal({ src, alt = 'Image', isOpen, onClose }: ImageViewerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl w-full h-[85vh] p-0 overflow-hidden bg-transparent border-none shadow-none text-white [&>button]:hidden">
                <DialogTitle className="sr-only">Image Viewer</DialogTitle>

                <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden bg-black/90 backdrop-blur-sm ring-1 ring-white/10">
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6" />
                    </Button>

                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={4}
                        centerOnInit
                    >
                        {({ zoomIn, zoomOut, resetTransform, instance }) => (
                            <>
                                {/* Controls */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex gap-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 p-1.5 shadow-2xl">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-white/90 hover:text-white hover:bg-white/20 rounded-full"
                                        onClick={() => zoomOut()}
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-white/90 hover:text-white hover:bg-white/20 rounded-full"
                                        onClick={() => zoomIn()}
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </Button>

                                    <div className="w-px bg-white/20 my-2 mx-1" />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-white/90 hover:text-white hover:bg-white/20 rounded-full"
                                        onClick={() => resetTransform()}
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Image Container */}
                                <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center">
                                    <TransformComponent
                                        wrapperClass="!w-full !h-full flex items-center justify-center"
                                        contentClass="!w-full !h-full flex items-center justify-center"
                                    >
                                        <img
                                            src={src}
                                            alt={alt}
                                            className="max-w-full max-h-full object-contain pointer-events-auto"
                                            style={{ maxHeight: '80vh' }}
                                        />
                                    </TransformComponent>
                                </div>
                            </>
                        )}
                    </TransformWrapper>
                </div>
            </DialogContent>
        </Dialog>
    );
}

