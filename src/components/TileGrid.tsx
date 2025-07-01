
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
        className={`tile ${isRevealed ? 'revealed' : ''}`}
        onClick={() => onTileClick(index)}
        style={{
          backgroundImage: isRevealed && imageLoaded ? `url(${imageUrl})` : 'none',
          backgroundSize: '500% 500%',
          backgroundPosition: `${col * 25}% ${row * 25}%`,
          backgroundColor: isRevealed ? 'transparent' : '#1F2937',
        }}
      >
        {/* Show number only when tile is not revealed */}
        {!isRevealed && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rider-black to-rider-black-light border border-rider-metal">
            <span className="font-orbitron font-bold text-lg text-rider-gold">
              {index + 1}
            </span>
          </div>
        )}
        
        {isRevealed && imageLoaded && (
          <div className="w-full h-full animate-tile-reveal absolute inset-0 -z-10" />
        )}
        
        {isRevealed && !imageLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-muted absolute inset-0">
            <div className="text-xs text-muted-foreground">Loading...</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tile-grid">
      {Array.from({ length: 25 }, (_, index) => renderTile(index))}
    </div>
  );
};

export default TileGrid;
