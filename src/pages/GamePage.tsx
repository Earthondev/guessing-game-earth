
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useGameState } from "@/hooks/useGameState";
import GameHeader from "@/components/GameHeader";
import GameInfo from "@/components/GameInfo";
import GameCompleted from "@/components/GameCompleted";
import GameDisplay from "@/components/GameDisplay";
import GameControls from "@/components/GameControls";
import GameStats from "@/components/GameStats";
import YouTubePromotionModal from "@/components/YouTubePromotionModal";
import YouTubeFloatingButton from "@/components/YouTubeFloatingButton";

const GamePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');

  useEffect(() => {
    if (!category) {
      navigate('/');
    }
  }, [category, navigate]);

  if (!category) return null;
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const {
    gameState,
    loadImages,
    handleTileClick,
    handleCorrectAnswer,
    revealAll,
    nextQuestion,
    resetGame,
  } = useGameState(category);

  useEffect(() => {
    loadImages();
  }, [category]);

  // Show YouTube promotion modal when game is completed
  useEffect(() => {
    if (gameState.gameCompleted && !hasShownModal) {
      const timer = setTimeout(() => {
        setShowYouTubeModal(true);
        setHasShownModal(true);
      }, 2000); // Show modal 2 seconds after game completion

      return () => clearTimeout(timer);
    }
  }, [gameState.gameCompleted, hasShownModal]);

  const revealedCount = gameState.revealedTiles.filter(Boolean).length;
  const canGoNext = gameState.allRevealed && gameState.currentImageIndex + 1 < gameState.currentRoundImages.length;
  const isLastQuestion = gameState.currentImageIndex + 1 >= gameState.currentRoundImages.length;

  if (gameState.loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <Card className="bg-gray-900 border-red-500 border-2">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <img
                src="/lovable-uploads/335da3d0-e2ee-42b1-9641-23af0f38de4a.png"
                alt="Loading..."
                className="w-24 h-24 mx-auto animate-bounce"
              />
            </div>
            <p className="text-white text-lg">กำลังโหลดรูปภาพ...</p>
            <p className="text-gray-400 text-sm mt-2">กรุณารอสักครู่</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-4xl mx-auto">
        <GameHeader
          categoryDisplayName={gameState.categoryDisplayName}
          currentImageIndex={gameState.currentImageIndex}
          totalScore={gameState.totalScore}
          score={gameState.score}
          gameCompleted={gameState.gameCompleted}
          revealedCount={revealedCount}
          totalQuestions={10}
        />

        {gameState.currentImage && (
          <GameInfo
            currentImage={gameState.currentImage}
            allRevealed={gameState.allRevealed}
            gameCompleted={gameState.gameCompleted}
          />
        )}

        {gameState.gameCompleted && (
          <GameCompleted
            totalScore={gameState.totalScore}
            onResetGame={resetGame}
            totalQuestions={10}
          />
        )}

        {gameState.currentImage && !gameState.gameCompleted && (
          <div className="mb-8">
            <GameDisplay
              currentImage={gameState.currentImage}
              showOriginal={gameState.showOriginal}
              allRevealed={gameState.allRevealed}
              revealedTiles={gameState.revealedTiles}
              onTileClick={handleTileClick}
              onNextQuestion={nextQuestion}
              canGoNext={canGoNext}
              isLastQuestion={isLastQuestion}
              onResetGame={resetGame}
            />
          </div>
        )}

        {gameState.currentImage && !gameState.gameCompleted && !gameState.allRevealed && (
          <GameControls
            allRevealed={gameState.allRevealed}
            onCorrectAnswer={handleCorrectAnswer}
            onRevealAll={revealAll}
            onResetGame={resetGame}
            acceptedAnswers={gameState.currentImage.acceptedAnswers || [gameState.currentImage.answer]}
          />
        )}

        {gameState.currentImage && !gameState.gameCompleted && !gameState.allRevealed && (
          <GameStats
            revealedCount={revealedCount}
            score={gameState.score}
            totalScore={gameState.totalScore}
          />
        )}
      </div>

      {/* YouTube Promotion Modal */}
      <YouTubePromotionModal
        isOpen={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
        videoId="jWH_kwAqgc8"
        title="🎉 Amazing job! Ready for more fun?"
        description="Loved solving puzzles? Check out our YouTube channel for behind-the-scenes content and gaming adventures!"
      />

      {/* Floating YouTube Button */}
      <YouTubeFloatingButton
        videoId="jWH_kwAqgc8"
        channelName="Our Usual Day"
      />
    </div>
  );
};

export default GamePage;
