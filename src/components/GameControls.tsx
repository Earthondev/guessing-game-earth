
import { CheckCircle, Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameControlsProps {
  allRevealed: boolean;
  onCorrectAnswer: () => void;
  onRevealAll: () => void;
  onResetGame: () => void;
}

const GameControls = ({ 
  allRevealed, 
  onCorrectAnswer, 
  onRevealAll, 
  onResetGame 
}: GameControlsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Button
        onClick={onCorrectAnswer}
        disabled={allRevealed}
        className="bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        ถูกต้อง!
      </Button>
      
      <Button
        onClick={onRevealAll}
        disabled={allRevealed}
        className="bg-orange-600 hover:bg-orange-700 text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Eye className="w-4 h-4 mr-2" />
        เฉลย (0 คะแนน)
      </Button>
      
      <Button
        onClick={onResetGame}
        variant="outline"
        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-300"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        เล่นใหม่
      </Button>
    </div>
  );
};

export default GameControls;
