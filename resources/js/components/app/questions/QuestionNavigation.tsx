import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

interface QuestionNavigationProps {
    totalQuestions: number;
    currentQuestionId?: string; // Optional: to highlight current matching question if tracking scroll
    onQuestionClick: (index: number) => void;
    onScrollToTop: () => void;
}

export default function QuestionNavigation({
    totalQuestions,
    onQuestionClick,
    onScrollToTop
}: QuestionNavigationProps) {
    return (
        <>
            <div className="sticky top-24 space-y-4">
                <div className="bg-card border rounded-lg shadow-sm p-4">
                    <div className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider text-center">
                        Navigasi Soal
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                        {Array.from({ length: totalQuestions }).map((_, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "h-9 w-9 p-0 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors",
                                    // You can add 'bg-primary text-primary-foreground' here if tracking active question
                                )}
                                onClick={() => onQuestionClick(index)}
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <Button
                variant="default"
                size="icon"
                className="fixed bottom-8 right-8 z-50 rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all"
                onClick={onScrollToTop}
                title="Kembali ke Atas"
            >
                <ArrowUp className="w-5 h-5" />
            </Button>
        </>
    );
}
