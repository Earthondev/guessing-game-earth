interface GameStatsProps {
    revealedCount: number;
    score: number;
    totalScore: number;
}

const GameStats = ({ revealedCount, score, totalScore }: GameStatsProps) => {
    // This is less important if Header already shows it, but we can make a mobile-friendly 
    // bottom bar or just a duplicate display for convenience if the user scrolls down
    return (
        <div className="grid grid-cols-3 gap-2 mt-12 p-4 bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm text-center">
            <div className="p-2">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">เปิดแล้ว</div>
                <div className="text-lg font-bold text-gray-300">{revealedCount} <span className="text-sm font-normal text-gray-600">/ 25</span></div>
            </div>
            <div className="p-2 border-l border-white/5">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">ข้อนี้</div>
                <div className="text-lg font-bold text-primary">{score}</div>
            </div>
            <div className="p-2 border-l border-white/5">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">รวม</div>
                <div className="text-lg font-bold text-amber-500">{totalScore}</div>
            </div>
        </div>
    );
};

export default GameStats;
