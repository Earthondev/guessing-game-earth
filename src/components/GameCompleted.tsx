
import { Link } from "react-router-dom";
import { Shuffle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameCompletedProps {
  totalScore: number;
  onResetGame: () => void;
  totalQuestions?: number;
}

const GameCompleted = ({ totalScore, onResetGame, totalQuestions = 10 }: GameCompletedProps) => {
  const maxScore = totalQuestions * 25;
  
  const getScoreMessage = (score: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "🌟 ยอดเยี่ยม! คุณรู้จักหมวดหมู่นี้ดีมาก!";
    if (percentage >= 60) return "👍 ดีมาก! คุณมีความรู้ในระดับดี";
    if (percentage >= 40) return "😊 พอใช้! ลองเล่นอีกครั้งเพื่อพัฒนา";
    return "💪 ลองใหม่อีกครั้ง! ฝึกฝนแล้วจะเก่งขึ้น";
  };

  const handleResetClick = () => {
    console.log('Reset button clicked');
    onResetGame();
  };

  return (
    <Card className="bg-gray-900 border-green-500 border-2 mb-6">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-4">🏁 เกมจบแล้ว!</h2>
        <p className="text-xl text-white mb-4">คะแนนรวม: {totalScore} / {maxScore} คะแนน</p>
        <p className="text-gray-300 mb-6">{getScoreMessage(totalScore)}</p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleResetClick}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            เล่นใหม่ (สุ่มอีกรอบ)
          </Button>
          <Link to="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-6 py-3">
              <Home className="w-4 h-4 mr-2" />
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCompleted;
