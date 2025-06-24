
import { Card, CardContent } from "@/components/ui/card";

interface GameStatsProps {
  revealedCount: number;
  score: number;
  totalScore: number;
}

const GameStats = ({ revealedCount, score, totalScore }: GameStatsProps) => {
  return (
    <Card className="bg-white border-gray-300 mt-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-blue-600">{revealedCount}</div>
            <div className="text-sm text-gray-600">ช่องที่เปิด</div>
          </div>
          <div className="transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-green-600">{25 - revealedCount}</div>
            <div className="text-sm text-gray-600">ช่องที่เหลือ</div>
          </div>
          <div className="transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-orange-600">{score}</div>
            <div className="text-sm text-gray-600">คะแนนคำถามนี้</div>
          </div>
          <div className="transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-black">{totalScore}</div>
            <div className="text-sm text-gray-600">คะแนนรวม</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;
