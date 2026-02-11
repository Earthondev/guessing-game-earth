
import { Card, CardContent } from "@/components/ui/card";

interface GameStatsProps {
  revealedCount: number;
  score: number;
  totalScore: number;
}

const GameStats = ({ revealedCount, score, totalScore }: GameStatsProps) => {
  return (
    <Card className="bg-gray-900 border-red-500 border-2 mt-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="transform hover:scale-105 transition-transform bg-gray-800 p-4 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-red-400">{revealedCount}</div>
            <div className="text-sm text-gray-400">ช่องที่เปิด</div>
          </div>
          <div className="transform hover:scale-105 transition-transform bg-gray-800 p-4 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-green-400">{25 - revealedCount}</div>
            <div className="text-sm text-gray-400">ช่องที่เหลือ</div>
          </div>
          <div className="transform hover:scale-105 transition-transform bg-gray-800 p-4 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-orange-400">{score}</div>
            <div className="text-sm text-gray-400">คะแนนคำถามนี้</div>
          </div>
          <div className="transform hover:scale-105 transition-transform bg-gray-800 p-4 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-yellow-400">{totalScore}</div>
            <div className="text-sm text-gray-400">คะแนนรวม</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;
