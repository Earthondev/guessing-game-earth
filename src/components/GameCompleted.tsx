import { Button } from "@/components/ui/button";
import { Trophy, RefreshCcw, Home, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameCompletedProps {
    totalScore: number;
    onResetGame: () => void;
    totalQuestions: number;
    category: string;
}

const GameCompleted = ({ totalScore, onResetGame, totalQuestions }: GameCompletedProps) => {
    const navigate = useNavigate();
    const maxScore = totalQuestions * 100;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let message = "พยายามได้ดี!";
    let subMessage = "สู้ต่อไปนะ";
    let color = "text-blue-400";

    if (percentage >= 80) {
        message = "สุดยอดไปเลย!";
        subMessage = "คุณคือแฟนพันธุ์แท้ตัวจริง";
        color = "text-amber-400";
    } else if (percentage >= 50) {
        message = "เก่งมาก!";
        subMessage = "มีความรู้แน่นปึ้ก";
        color = "text-emerald-400";
    }

    return (
        <div className="animate-in zoom-in-95 duration-500 px-4">
            <Card className="bg-gray-900/80 border-primary/20 shadow-2xl backdrop-blur-xl max-w-lg mx-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <CardHeader className="text-center pb-2 relative z-10">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                        <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                    </div>
                    <CardTitle className="text-4xl font-black text-white mb-2">{message}</CardTitle>
                    <p className={`${color} font-medium`}>{subMessage}</p>
                </CardHeader>

                <CardContent className="space-y-8 text-center relative z-10">
                    <div className="space-y-2 py-6 bg-gray-950/50 rounded-2xl border border-gray-800/50 mx-4">
                        <p className="text-gray-400 uppercase text-xs tracking-widest font-semibold">คะแนนรวมของคุณ</p>
                        <div className="flex items-baseline justify-center gap-2">
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                                {totalScore}
                            </span>
                            <span className="text-xl text-gray-500 font-medium">/ {maxScore}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={onResetGame}
                            className="w-full h-14 text-lg gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            variant="default"
                        >
                            <RefreshCcw className="w-5 h-5" /> เล่นอีกครั้ง
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            className="w-full h-14 text-lg gap-2 font-bold hover:scale-105 transition-transform hover:bg-white/10"
                            variant="secondary"
                        >
                            <Home className="w-5 h-5" /> หน้าหลัก
                        </Button>
                    </div>

                    <Button variant="ghost" className="w-full text-gray-500 hover:text-white" size="sm">
                        <Share2 className="w-4 h-4 mr-2" /> แชร์คะแนน
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameCompleted;
