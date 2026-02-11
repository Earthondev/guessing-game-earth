import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface GameHeaderProps {
    categoryDisplayName: string;
    currentImageIndex: number;
    totalScore: number;
    score: number;
    gameCompleted: boolean;
    revealedCount: number;
    totalQuestions: number;
    onTimeUp?: () => void;
    onTick?: () => void;
    isTimerActive?: boolean;
}

const GameHeader = ({
    categoryDisplayName,
    currentImageIndex,
    totalScore,
    score,
    revealedCount,
    totalQuestions,
}: GameHeaderProps) => {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg px-4 py-1 border-primary/50 text-emerald-400 bg-emerald-950/30">
                        {categoryDisplayName}
                    </Badge>
                    <div className="flex items-center gap-2 text-gray-400 font-medium bg-gray-800/50 px-3 py-1 rounded-md">
                        <span>ข้อที่</span>
                        <span className="text-white text-xl">{currentImageIndex + 1}</span>
                        <span className="text-sm">/ {totalQuestions}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold">คะแนนรวม</span>
                        <span className="text-xl md:text-3xl font-black text-amber-500 drop-shadow-sm">{totalScore}</span>
                    </div>
                    <div className="h-10 w-px bg-gray-700/50"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold">คะแนนข้อนี้</span>
                        <span className="text-xl md:text-3xl font-black text-primary drop-shadow-sm">{score}</span>
                    </div>
                </div>
            </div>

            <div className="relative pt-2 px-1">
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>เปิดแล้ว {revealedCount}/25</span>
                    </div>
                    <span>{Math.round((revealedCount / 25) * 100)}%</span>
                </div>
                <Progress value={(revealedCount / 25) * 100} className="h-2 bg-gray-800" />
            </div>
        </div>
    );
};

export default GameHeader;
