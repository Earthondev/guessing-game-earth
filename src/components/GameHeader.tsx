
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  categoryDisplayName: string;
  currentImageIndex: number;
  totalScore: number;
  score: number;
  gameCompleted: boolean;
  revealedCount: number;
}

const GameHeader = ({ 
  categoryDisplayName, 
  currentImageIndex, 
  totalScore, 
  score, 
  gameCompleted,
  revealedCount 
}: GameHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon" className="hover:scale-105 transition-transform border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
            <Home className="w-4 h-4" />
          </Button>
        </Link>
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-black">
            {categoryDisplayName}
          </h1>
          <p className="text-sm text-gray-600">
            {gameCompleted ? 'เกมจบแล้ว' : `คำถามที่ ${currentImageIndex + 1}/5`} | คะแนนรวม: {totalScore + (gameCompleted ? 0 : score)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          คะแนนคำถามนี้: <span className="text-blue-600 font-bold">{score}</span>
        </div>
        <div className="text-sm text-gray-600">
          เปิดแล้ว <span className="text-blue-600 font-bold">{revealedCount}</span>/25 ช่อง
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
