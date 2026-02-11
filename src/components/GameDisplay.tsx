import { ImageData } from "@/types/game";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";

interface GameDisplayProps {
    currentImage: ImageData;
    showOriginal: boolean;
    allRevealed: boolean;
    revealedTiles: boolean[];
    onTileClick: (index: number) => void;
    onNextQuestion: () => void;
    canGoNext: boolean;
    isLastQuestion: boolean;
    onResetGame: () => void;
}

const GameDisplay = ({
    currentImage,
    showOriginal,
    allRevealed,
    revealedTiles,
    onTileClick,
    onNextQuestion,
    canGoNext,
    isLastQuestion,
}: GameDisplayProps) => {

    return (
        <div className="space-y-6">
            <div className="relative aspect-video w-full max-w-3xl mx-auto overflow-hidden rounded-2xl border-4 border-gray-800 shadow-2xl bg-black group">
                {/* The Image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <img
                        src={showOriginal && currentImage.originalImageUrl
                            ? currentImage.originalImageUrl
                            : currentImage.imageUrl}
                        alt="Guess this"
                        className={`w-full h-full object-contain transition-all duration-700 ease-in-out ${allRevealed ? 'scale-100 blur-0 opacity-100' : 'scale-110 opacity-90'
                            }`}
                    />
                </div>

                {/* The Grid Overlay */}
                {!showOriginal && (
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 z-10 perspective-1000">
                        {Array.from({ length: 25 }).map((_, index) => (
                            <div
                                key={index}
                                onClick={() => onTileClick(index)}
                                className={`
                  relative border-r border-b border-gray-900/30 cursor-pointer overflow-hidden
                  transition-all duration-500 transform-style-3d
                  ${revealedTiles[index]
                                        ? 'opacity-0 pointer-events-none'
                                        : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600 active:scale-95'}
                `}
                                style={{
                                    transitionDelay: `${index * 10}ms`
                                }}
                            >
                                {!revealedTiles[index] && (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600/50 font-bold select-none text-xl sm:text-2xl">
                                        {index + 1}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Flash effect on reveal */}
                {allRevealed && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                )}
            </div>

            {canGoNext && (
                <div className="flex justify-center pt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <Button
                        onClick={onNextQuestion}
                        size="lg"
                        className="text-xl px-12 py-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 font-bold gap-3"
                    >
                        {isLastQuestion ? (
                            <>
                                <span>ดูผลคะแนน</span>
                                <ChevronRight className="w-6 h-6" />
                            </>
                        ) : (
                            <>
                                <span>ข้อต่อไป</span>
                                <ArrowRight className="w-6 h-6" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default GameDisplay;
