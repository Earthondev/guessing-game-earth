
import { Card, CardContent } from "@/components/ui/card";
import TileGrid from "@/components/TileGrid";
import { ImageData } from "@/types/game";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface GameDisplayProps {
  currentImage: ImageData;
  showOriginal: boolean;
  allRevealed: boolean;
  revealedTiles: boolean[];
  onTileClick: (index: number) => void;
  onNextQuestion?: () => void;
  canGoNext?: boolean;
}

const GameDisplay = ({ 
  currentImage, 
  showOriginal, 
  allRevealed, 
  revealedTiles, 
  onTileClick,
  onNextQuestion,
  canGoNext
}: GameDisplayProps) => {
  if (showOriginal && allRevealed) {
    return (
      <Card className="bg-gray-900 border-green-500 border-2">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-green-400">
              🖼️ เฉลย: {currentImage.answer}
            </h3>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-gray-800 mb-4">
            <img
              src={currentImage.originalImageUrl || currentImage.imageUrl}
              alt={currentImage.answer}
              className="w-full max-h-96 object-contain mx-auto"
              onError={(e) => {
                console.error('Error loading original image:', e);
                (e.target as HTMLImageElement).src = currentImage.imageUrl;
              }}
            />
          </div>
          {canGoNext && onNextQuestion && (
            <div className="text-center">
              <Button
                onClick={onNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                ข้อถัดไป
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="transition-all duration-500">
      <TileGrid
        imageUrl={currentImage.imageUrl}
        revealedTiles={revealedTiles}
        onTileClick={onTileClick}
      />
    </div>
  );
};

export default GameDisplay;
