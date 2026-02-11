
import { useState } from "react";
import { Link } from "react-router-dom";
import { Shuffle, Home, Trophy, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLeaderboard } from "@/hooks/useLeaderboard";

interface GameCompletedProps {
  totalScore: number;
  onResetGame: () => void;
  totalQuestions?: number;
  category?: string;
}

const PLAYER_NAME_KEY = "guessing_game_player_name";

const GameCompleted = ({ totalScore, onResetGame, totalQuestions = 10, category = "" }: GameCompletedProps) => {
  const maxScore = totalQuestions * 25;
  const percentage = (totalScore / maxScore) * 100;
  const [playerName, setPlayerName] = useState(() => localStorage.getItem(PLAYER_NAME_KEY) || "");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { submitScore } = useLeaderboard();

  const getScoreMessage = (score: number) => {
    if (percentage >= 80) return "🌟 ยอดเยี่ยม! คุณรู้จักหมวดหมู่นี้ดีมาก!";
    if (percentage >= 60) return "👍 ดีมาก! คุณมีความรู้ในระดับดี";
    if (percentage >= 40) return "😊 พอใช้! ลองเล่นอีกครั้งเพื่อพัฒนา";
    return "💪 ลองใหม่อีกครั้ง! ฝึกฝนแล้วจะเก่งขึ้น";
  };

  const getScoreEmoji = () => {
    if (percentage >= 80) return "🏆";
    if (percentage >= 60) return "🥈";
    if (percentage >= 40) return "🥉";
    return "🎮";
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    localStorage.setItem(PLAYER_NAME_KEY, playerName.trim());
    const success = await submitScore(playerName.trim(), totalScore, category, totalQuestions);
    if (success) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const handleResetClick = () => {
    onResetGame();
  };

  return (
    <Card className="border-2 mb-6 bg-[#0d0d0d] border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
      <CardContent className="p-8">
        {/* Score Display */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{getScoreEmoji()}</div>
          <h2 className="text-2xl font-heading font-bold text-gold mb-2">เกมจบแล้ว!</h2>
          <div className="inline-flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-white tabular-nums">{totalScore}</span>
            <span className="text-lg text-gray-500">/ {maxScore}</span>
          </div>

          {/* Score bar */}
          <div className="w-full max-w-xs mx-auto h-2 bg-white/5 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${percentage}%`,
                background: percentage >= 80
                  ? "linear-gradient(90deg, #facc15, #f59e0b)"
                  : percentage >= 60
                    ? "linear-gradient(90deg, #22d3ee, #3b82f6)"
                    : percentage >= 40
                      ? "linear-gradient(90deg, #f97316, #ef4444)"
                      : "linear-gradient(90deg, #6b7280, #9ca3af)",
              }}
            />
          </div>
          <p className="text-gray-400 text-sm mb-4">{getScoreMessage(totalScore)}</p>

          {/* Social Share */}
          <div className="flex justify-center gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
              onClick={() => {
                const text = `ฉันได้ ${totalScore} คะแนนจากเกมทายภาพหมวด ${category}! มาลองเล่นกันเถอะ`;
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook mr-1"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              แชร์
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
              onClick={() => {
                const text = `ฉันได้ ${totalScore} คะแนนจากเกมทายภาพหมวด ${category}! 🎮 #GuessingGame`;
                const url = window.location.href;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter mr-1"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              ทวีต
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                const text = `ฉันได้ ${totalScore} คะแนนจากเกมทายภาพหมวด ${category}! มาลองเล่นกันเถอะ ${window.location.href}`;
                navigator.clipboard.writeText(text);
                alert("คัดลอกลิงก์เรียบร้อย!");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy mr-1"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
              คัดลอก
            </Button>
          </div>
        </div>

        {/* Submit Score Section */}
        {!submitted ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-gold" />
              <p className="text-sm font-medium text-white">บันทึกคะแนนลง Leaderboard</p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="ชื่อของคุณ..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitScore()}
                maxLength={20}
                className="bg-rich-black-lighter border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50"
              />
              <Button
                onClick={handleSubmitScore}
                disabled={!playerName.trim() || submitting}
                className="luxury-button shrink-0 px-5"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1.5" />
                    บันทึก
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Check className="w-5 h-5" />
              <p className="font-medium">บันทึกคะแนนเรียบร้อย!</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleResetClick}
            className="luxury-button px-6 py-3"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            เล่นใหม่
          </Button>
          <Link to="/">
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              หน้าหลัก
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCompleted;
