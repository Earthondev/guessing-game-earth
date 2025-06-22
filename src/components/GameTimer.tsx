
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface GameTimerProps {
  isActive: boolean;
  onTimeUp?: () => void;
  duration?: number; // in seconds
  showMilliseconds?: boolean;
}

const GameTimer = ({ 
  isActive, 
  onTimeUp, 
  duration = 60, 
  showMilliseconds = false 
}: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return "text-green-500";
    if (percentage > 25) return "text-yellow-500";
    return "text-red-500 animate-pulse";
  };

  return (
    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getColorClass()}`}>
      <Clock className="w-5 h-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default GameTimer;
