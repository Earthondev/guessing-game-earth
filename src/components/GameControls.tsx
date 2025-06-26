
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnswerInput from "@/components/AnswerInput";

interface GameControlsProps {
  allRevealed: boolean;
  onCorrectAnswer: () => void;
  onRevealAll: () => void;
  onResetGame: () => void;
  acceptedAnswers: string[];
  onWrongAnswer?: () => void;
}

const GameControls = ({ 
  allRevealed, 
  onCorrectAnswer, 
  onRevealAll, 
  onResetGame,
  acceptedAnswers,
  onWrongAnswer = () => {}
}: GameControlsProps) => {
  return (
    <div className="space-y-4">
      <AnswerInput
        onCorrectAnswer={onCorrectAnswer}
        onRevealAnswer={onRevealAll}
        onWrongAnswer={onWrongAnswer}
        acceptedAnswers={acceptedAnswers}
        disabled={allRevealed}
      />
      
      <Button
        onClick={onResetGame}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-300"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        เล่นใหม่
      </Button>
    </div>
  );
};

export default GameControls;
