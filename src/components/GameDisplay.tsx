
import { Card, CardContent } from "@/components/ui/card";
import TileGrid from "@/components/TileGrid";
import { ImageData } from "@/types/game";

interface GameDisplayProps {
  currentImage: ImageData;
  showOriginal: boolean;
  allRevealed: boolean;
  revealedTiles: boolean[];
  onTileClick: (index: number) => void;
}

const GameDisplay = ({ 
  currentImage, 
  showOriginal, 
  allRevealed, 
  revealedTiles, 
  onTileClick 
}: GameDisplayProps) => {
  if (showOriginal && allRevealed) {
    return (
      <Card className="bg-white border-green-500">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-green-600">
              🖼️ รูปต้นฉบับเต็ม
            </h3>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={currentImage.originalImageUrl || currentImage.imageUrl}
              alt={currentImage.answer}
              className="w-full max-h-96 object-contain mx-auto"
              onError={(e) => {
                console.error('Error loading original image:', e);
                (e.target as HTMLImageElement).src = currentImage.imageUrl;
              }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                {currentImage.answer}
              </div>
            </div>
          </div>
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
