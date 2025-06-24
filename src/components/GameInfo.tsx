
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageData } from "@/types/game";

interface GameInfoProps {
  currentImage: ImageData;
  allRevealed: boolean;
  gameCompleted: boolean;
}

const GameInfo = ({ currentImage, allRevealed, gameCompleted }: GameInfoProps) => {
  if (gameCompleted) return null;

  return (
    <Card className="bg-white border-gray-300 mb-6">
      <CardHeader>
        <CardTitle className={`text-center font-bold transition-all duration-700 ${
          allRevealed ? 'text-green-600' : 'text-blue-600'
        }`}>
          <div className="transition-all duration-500 transform">
            {allRevealed ? (
              <div className="animate-scale-in">
                🎉 เฉลย: {currentImage.answer}
              </div>
            ) : (
              <div className="animate-fade-in">
                ทายจากภาพนี้
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default GameInfo;
