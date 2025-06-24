
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
          <Button variant="outline" size="icon" className="hover:scale-105 transition-transform border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
            <Home className="w-4 h-4" />
          </Button>
        </Link>
        <div className="animate-fade-in">
          <a
            href="https://www.youtube.com/@OurUsualday"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:scale-110 transition-transform duration-300"
          >
            <h1 className="text-4xl font-bold text-red-500 hover:text-red-400 cursor-pointer bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
              🎮 GUESS GAME
            </h1>
          </a>
          <h2 className="text-2xl font-bold text-white mt-2">
            {categoryDisplayName}
          </h2>
          <p className="text-sm text-gray-400">
            {gameCompleted ? 'เกมจบแล้ว' : `คำถามที่ ${currentImageIndex + 1}/5`} | คะแนนรวม: {totalScore + (gameCompleted ? 0 : score)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded-lg border border-gray-600">
          คะแนนคำถามนี้: <span className="text-red-400 font-bold">{score}</span>
        </div>
        <div className="text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded-lg border border-gray-600">
          เปิดแล้ว <span className="text-red-400 font-bold">{revealedCount}</span>/25 ช่อง
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
