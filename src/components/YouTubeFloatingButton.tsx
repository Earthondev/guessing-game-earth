import { useState } from "react";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeFloatingButtonProps {
  videoId: string;
  channelName?: string;
}

const YouTubeFloatingButton = ({ 
  videoId,
  channelName = "Our Usual Day"
}: YouTubeFloatingButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
        size="icon"
      >
        <Youtube className="w-6 h-6" />
      </Button>
      
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap animate-fade-in">
          {channelName}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
        </div>
      )}
    </div>
  );
};

export default YouTubeFloatingButton;