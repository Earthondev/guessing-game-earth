import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface YouTubePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
  description?: string;
}

const YouTubePromotionModal = ({ 
  isOpen, 
  onClose, 
  videoId,
  title = "🎉 Great job! Want to see more?",
  description = "Loved the game? Check out the behind-the-scenes fun on our channel!"
}: YouTubePromotionModalProps) => {
  if (!isOpen) return null;

  const handleWatchOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="max-w-md w-full bg-white border-primary/20 shadow-2xl animate-scale-in">
        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="font-heading text-xl text-foreground pr-8">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="YouTube video thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-muted-foreground text-center">
            {description}
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleWatchOnYouTube}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-heading"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch on YouTube
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-muted-foreground/30 text-muted-foreground hover:bg-muted"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubePromotionModal;