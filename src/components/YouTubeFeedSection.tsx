import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
          From Our YouTube Channel
        </h2>
        <p className="text-muted-foreground text-lg">
          Don't miss our latest videos and gaming adventures
        </p>
      </div>

      <Card className="bg-white border border-primary/10 shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="aspect-video relative bg-muted group cursor-pointer" onClick={handleWatchOnYouTube}>
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="YouTube video thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors duration-300">
                <div className="bg-primary/90 text-white rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <h3 className="font-heading font-bold text-xl text-foreground mb-4">
              {title}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {description}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleWatchOnYouTube}
                className="bg-primary hover:bg-primary/90 text-white font-heading"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
              <Button
                onClick={() => window.open('https://www.youtube.com/@OurUsualday', '_blank')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
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