
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useGameState } from "@/hooks/useGameState";
import GameHeader from "@/components/GameHeader";
import GameInfo from "@/components/GameInfo";
import GameCompleted from "@/components/GameCompleted";
import GameDisplay from "@/components/GameDisplay";
import GameControls from "@/components/GameControls";
import GameStats from "@/components/GameStats";

const GamePage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'masked_rider';
  
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

  const revealedCount = gameState.revealedTiles.filter(Boolean).length;
  const canGoNext = gameState.allRevealed && gameState.currentImageIndex + 1 < gameState.currentRoundImages.length;

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
    </div>
  );
};

export default GamePage;
