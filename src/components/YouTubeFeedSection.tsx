import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface YouTubeFeedSectionProps {
  videoId: string;
  title?: string;
  description?: string;
}

const YouTubeFeedSection = ({ 
  videoId,
  title = "Latest from Our YouTube Channel",
  description = "Join us for puzzle-solving adventures and behind-the-scenes content!"
}: YouTubeFeedSectionProps) => {
  const handleWatchOnYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleWatchOnYouTube();
    }
  };

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
          From Our YouTube Channel
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Don't miss our latest videos and gaming adventures
        </p>
      </div>

      <Card className="bg-white border border-primary/20 rounded-xl shadow-xl hover:shadow-primary/30 transition-all duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <div 
              className="aspect-video relative bg-muted group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 rounded-lg"
              onClick={handleWatchOnYouTube}
              onKeyDown={handleKeyPress}
              tabIndex={0}
              role="button"
              aria-label={`Watch video titled ${title} on YouTube`}
            >
              <img
                loading="lazy"
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={`Thumbnail of YouTube video titled ${title}`}
                className="w-full h-full object-cover group-hover:scale-[1.03] group-focus:scale-[1.03] transition-transform duration-500 ease-in-out rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 group-focus:bg-black/50 transition-colors duration-300 rounded-lg">
                <div className="bg-primary/80 text-white rounded-full p-4 group-hover:scale-110 group-hover:bg-primary/90 group-focus:scale-110 group-focus:bg-primary/90 transition-all duration-300 shadow-lg">
                  <Play className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <h3 className="font-heading font-bold text-lg md:text-xl text-foreground mb-4 leading-tight">
              {title}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleWatchOnYouTube}
                aria-label="Watch video on YouTube"
                className="bg-primary/90 hover:bg-primary focus:bg-primary text-white font-heading shadow-md hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
              <Button
                onClick={() => window.open('https://www.youtube.com/@OurUsualday', '_blank')}
                variant="outline"
                aria-label="Visit Our Usual Day YouTube channel"
                className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 focus:bg-primary/5 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 transition-all duration-300"
              >
                Visit Channel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default YouTubeFeedSection;