
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
    resetGame,
  } = useGameState(category);

  useEffect(() => {
    loadImages();
  }, [category]);

  const revealedCount = gameState.revealedTiles.filter(Boolean).length;

  if (gameState.loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gray-100">
        <Card className="bg-white border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black">กำลังโหลดรูปภาพ...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <GameHeader
          categoryDisplayName={gameState.categoryDisplayName}
          currentImageIndex={gameState.currentImageIndex}
          totalScore={gameState.totalScore}
          score={gameState.score}
          gameCompleted={gameState.gameCompleted}
          revealedCount={revealedCount}
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
            />
          </div>
        )}

        {gameState.currentImage && !gameState.gameCompleted && (
          <GameControls
            allRevealed={gameState.allRevealed}
            onCorrectAnswer={handleCorrectAnswer}
            onRevealAll={revealAll}
            onResetGame={resetGame}
          />
        )}

        {gameState.currentImage && !gameState.gameCompleted && (
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
