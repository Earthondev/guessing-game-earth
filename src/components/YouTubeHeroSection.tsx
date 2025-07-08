import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeHeroSectionProps {
  videoId: string;
  title?: string;
  description?: string;
}

const YouTubeHeroSection = ({ 
  videoId, 
  title = "Watch Our Latest Adventure!",
  description = "Join us for behind-the-scenes fun and gameplay highlights"
}: YouTubeHeroSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleWatchOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
      <div className="aspect-video relative">
        {!isPlaying ? (
          <div className="w-full h-full bg-muted/30 flex items-center justify-center relative">
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="YouTube video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <Button
                  onClick={handlePlayVideo}
                  className="bg-primary hover:bg-primary/90 text-white font-heading text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Watch Now
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
      
      <div className="p-6 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-2">
              {title}
            </h3>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
          <Button
            onClick={handleWatchOnYouTube}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Watch on YouTube
          </Button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeHeroSection;