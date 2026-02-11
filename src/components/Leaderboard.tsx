import { useEffect, useState } from "react";
import { Trophy, Crown, Medal, Award, ChevronDown, ChevronUp } from "lucide-react";
import { useLeaderboard, LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardProps {
    category?: string;
}

const Leaderboard = ({ category }: LeaderboardProps) => {
    const { entries, loading, fetchLeaderboard } = useLeaderboard();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        fetchLeaderboard(category, expanded ? 20 : 5);
    }, [category, expanded, fetchLeaderboard]);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-300" />;
            case 3:
                return <Medal className="w-5 h-5 text-amber-600" />;
            default:
                return <span className="text-sm text-gray-500 w-5 text-center font-mono">{rank}</span>;
        }
    };

    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-transparent border-yellow-500/30";
            case 2:
                return "bg-gradient-to-r from-gray-400/10 via-gray-300/5 to-transparent border-gray-400/20";
            case 3:
                return "bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-transparent border-amber-600/20";
            default:
                return "bg-white/[0.02] border-white/5 hover:border-white/10";
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "เมื่อกี้";
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
        return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
    };

    if (loading && entries.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-gold/50 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">กำลังโหลด...</p>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-10">
                <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">ยังไม่มีคะแนน — เป็นคนแรกเลย!</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {entries.map((entry, index) => (
                <div
                    key={entry.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${getRankStyles(index + 1)}`}
                >
                    <div className="shrink-0 w-7 flex justify-center">
                        {getRankIcon(index + 1)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${index === 0 ? "text-yellow-300" : "text-white"}`}>
                            {entry.player_name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                            {formatDate(entry.created_at)}
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <p className={`font-bold tabular-nums ${index === 0 ? "text-yellow-400 text-lg" : "text-gold/80"}`}>
                            {entry.score}
                        </p>
                        <p className="text-[10px] text-gray-600">
                            / {entry.total_questions * 25}
                        </p>
                    </div>
                </div>
            ))}

            {entries.length >= 5 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-500 hover:text-gold/70 transition-colors"
                >
                    {expanded ? (
                        <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            แสดงน้อยลง
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            ดูเพิ่มเติม
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default Leaderboard;
