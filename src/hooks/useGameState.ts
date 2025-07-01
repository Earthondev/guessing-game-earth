
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageData, GameState } from "@/types/game";
import { getCategoryDisplayName, loadImagesFromSupabase, selectGameImages } from "@/utils/gameUtils";

export const useGameState = (category: string) => {
  const [gameState, setGameState] = useState<GameState>({
    currentImage: null,
    revealedTiles: Array(25).fill(false),
    allRevealed: false,
    showOriginal: false,
    currentRoundImages: [],
    currentImageIndex: 0,
    loading: false,
    score: 25,
    totalScore: 0,
    questionsAnswered: 0,
    gameCompleted: false,
    categoryDisplayName: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    getCategoryDisplayName(category).then(displayName => 
      setGameState(prev => ({ ...prev, categoryDisplayName: displayName }))
    );
  }, [category]);

  const loadImages = async () => {
    setGameState(prev => ({ ...prev, loading: true }));
    try {
      const validImages = await loadImagesFromSupabase(category);
      startNewGame(validImages);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลเกมได้",
        variant: "destructive",
      });
    } finally {
      setGameState(prev => ({ ...prev, loading: false }));
    }
  };

  const startNewGame = (imageList: ImageData[]) => {
    if (imageList.length === 0) return;
    
    // เปลี่ยนจาก 5 เป็น 10 เกม
    const gameImages = selectGameImages(imageList, 10);
    
    setGameState(prev => ({
      ...prev,
      currentRoundImages: gameImages,
      currentImageIndex: 0,
      currentImage: gameImages[0],
      revealedTiles: Array(25).fill(false),
      allRevealed: false,
      showOriginal: false,
      score: 25,
      totalScore: 0,
      questionsAnswered: 0,
      gameCompleted: false,
    }));
  };

  const handleTileClick = (index: number) => {
    if (gameState.revealedTiles[index] || gameState.allRevealed) return;

    const newRevealed = [...gameState.revealedTiles];
    newRevealed[index] = true;
    
    setGameState(prev => ({
      ...prev,
      revealedTiles: newRevealed,
      score: Math.max(0, prev.score - 5)
    }));
  };

  const handleCorrectAnswer = () => {
    if (gameState.allRevealed) return;

    setGameState(prev => ({
      ...prev,
      allRevealed: true,
      showOriginal: true,
      totalScore: prev.totalScore + prev.score, // แก้ไขการรวมคะแนนให้ถูกต้อง
    }));
    
    toast({
      title: "🎉 ถูกต้อง!",
      description: `${gameState.currentImage?.answer || "ไม่พบคำเฉลย"} - ได้ ${gameState.score} คะแนน`,
    });
  };

  const revealAll = () => {
    setGameState(prev => ({
      ...prev,
      revealedTiles: Array(25).fill(true),
      allRevealed: true,
      showOriginal: true,
      score: 0,
    }));
    
    toast({
      title: "📖 เฉลย!",
      description: `${gameState.currentImage?.answer || "ไม่พบคำเฉลย"} - ได้ 0 คะแนน`,
    });
  };

  const nextQuestion = () => {
    const nextIndex = gameState.currentImageIndex + 1;
    
    // เปลี่ยนจาก 5 เป็น 10 เกม
    if (nextIndex >= gameState.currentRoundImages.length) {
      setGameState(prev => ({ 
        ...prev, 
        gameCompleted: true,
        questionsAnswered: prev.questionsAnswered + 1,
      }));
      toast({
        title: "🏁 จบเกม!",
        description: `คะแนนรวม: ${gameState.totalScore} คะแนน จาก 10 คำถาม`,
      });
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      currentImageIndex: nextIndex,
      currentImage: prev.currentRoundImages[nextIndex],
      revealedTiles: Array(25).fill(false),
      allRevealed: false,
      showOriginal: false,
      score: 25,
      questionsAnswered: prev.questionsAnswered + 1,
    }));
  };

  return {
    gameState,
    loadImages,
    handleTileClick,
    handleCorrectAnswer,
    revealAll,
    nextQuestion,
    resetGame: loadImages,
  };
};
