
import { useState, useEffect } from "react";

interface TileGridProps {
  imageUrl: string;
  revealedTiles: boolean[];
  onTileClick: (index: number) => void;
}

const TileGrid = ({ imageUrl, revealedTiles, onTileClick }: TileGridProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imageUrl;
  }, [imageUrl]);

  const renderTile = (index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    const isRevealed = revealedTiles[index];

    return (
      <div
        key={index}
        className={`flip-card ${isRevealed ? 'is-flipped' : ''}`}
        onClick={() => !isRevealed && onTileClick(index)}
      >
        <div className="flip-card-inner">
          {/* Front Side (Number) */}
          <div className="flip-card-front">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rider-black to-rider-black-light border border-rider-metal/30">
              <span className="font-orbitron font-bold text-lg text-rider-gold drop-shadow-md">
                {index + 1}
              </span>
            </div>
          </div>

          {/* Back Side (Image) */}
          <div
            className="flip-card-back"
            style={{
              backgroundImage: imageLoaded ? `url(${imageUrl})` : 'none',
              backgroundPosition: `${col * 25}% ${row * 25}%`,
            }}
          >
            {!imageLoaded && isRevealed && (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xs text-gray-500">
                Loading...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tile-grid gap-1">
      {Array.from({ length: 25 }, (_, index) => renderTile(index))}
    </div>
  );
};

export default TileGrid;
