import { ImageData } from "@/types/game";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface GameInfoProps {
    currentImage: ImageData;
    allRevealed: boolean;
    gameCompleted: boolean;
}

const GameInfo = ({ currentImage, allRevealed, gameCompleted }: GameInfoProps) => {
    if (!allRevealed && !gameCompleted) return null;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-500/30 overflow-hidden backdrop-blur-md shadow-xl shadow-green-900/10">
                <CardContent className="p-6 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        <span className="text-green-400 font-medium uppercase tracking-widest text-sm">คำตอบที่ถูกต้อง</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                        {currentImage.answer}
                    </h2>
                    {currentImage.originalImageUrl && (
                        <p className="mt-2 text-green-200/60 text-sm">
                            ภาพต้นฉบับ
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default GameInfo;
