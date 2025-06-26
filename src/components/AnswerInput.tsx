
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye } from "lucide-react";

interface AnswerInputProps {
  onCorrectAnswer: () => void;
  onRevealAnswer: () => void;
  onWrongAnswer: () => void;
  acceptedAnswers: string[];
  disabled?: boolean;
}

const AnswerInput = ({ 
  onCorrectAnswer, 
  onRevealAnswer, 
  onWrongAnswer, 
  acceptedAnswers,
  disabled = false 
}: AnswerInputProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showWrongMessage, setShowWrongMessage] = useState(false);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const isCorrect = acceptedAnswers.some(answer => 
      answer.toLowerCase() === normalizedUserAnswer
    );

    if (isCorrect) {
      onCorrectAnswer();
      setUserAnswer("");
      setShowWrongMessage(false);
    } else {
      setShowWrongMessage(true);
      onWrongAnswer();
      // Clear wrong message after 3 seconds
      setTimeout(() => setShowWrongMessage(false), 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      checkAnswer();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="พิมพ์คำตอบที่นี่..."
          disabled={disabled}
          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
        />
        <Button
          onClick={checkAnswer}
          disabled={disabled || !userAnswer.trim()}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          ตอบ
        </Button>
      </div>
      
      {showWrongMessage && (
        <div className="text-red-400 text-center animate-pulse">
          ❌ ตอบผิด! ลองใหม่อีกครั้ง
        </div>
      )}

      <Button
        onClick={onRevealAnswer}
        disabled={disabled}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
      >
        <Eye className="w-4 h-4 mr-2" />
        เฉลย (0 คะแนน)
      </Button>
    </div>
  );
};

export default AnswerInput;
