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
    <div className="relative mb-12 overflow-hidden rounded-2xl luxury-card border-gold/20">
      <div className="aspect-video relative">
        {!isPlaying ? (
          <div className="w-full h-full bg-rich-black/30 flex items-center justify-center relative">
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="YouTube video thumbnail"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <Button
                  onClick={handlePlayVideo}
                  className="luxury-button text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] animate-pulse"
                >
                  <Play className="w-6 h-6 mr-2 fill-current" />
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

      <div className="p-6 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-heading font-bold text-2xl text-gold mb-2 drop-shadow-md">
              {title}
            </h3>
            <p className="text-gray-300 font-light">
              {description}
            </p>
          </div>
          <Button
            onClick={handleWatchOnYouTube}
            variant="outline"
            className="border-gold text-gold hover:bg-gold hover:text-rich-black transition-all duration-300"
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