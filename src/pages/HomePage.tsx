
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Shield } from "lucide-react";
import CategorySelector, { GameCategory } from "@/components/CategorySelector";
import AuthModal from "@/components/AuthModal";
import YouTubeHeroSection from "@/components/YouTubeHeroSection";
import YouTubeFeedSection from "@/components/YouTubeFeedSection";
import YouTubeFloatingButton from "@/components/YouTubeFloatingButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .order('created_at');

      if (error) throw error;

      const categoriesWithImages = await Promise.all(
        data.map(async (category) => {
          let coverImageUrl = '';
          if (category.cover_image_path) {
            const { data: urlData } = supabase.storage
              .from('category-covers')
              .getPublicUrl(category.cover_image_path);
            coverImageUrl = urlData.publicUrl;
          }

          return {
            id: category.name, // Use name as ID for routing
            name: category.name,
            displayName: category.display_name,
            description: category.description,
            icon: category.icon || "🎮",
            color: "red-500",
            coverImage: coverImageUrl
          };
        })
      );

      setCategories(categoriesWithImages);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดหมวดหมู่ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // เปลี่ยนให้เข้าเกมทันทีเมื่อเลือกหมวดหมู่
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // เข้าเกมทันทีโดยไม่ต้องกดปุ่มเริ่ม
    navigate(`/game?category=${categoryId}`);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 gap-6">
            {/* Logo with link to YouTube */}
            <a 
              href="https://www.youtube.com/@OurUsualday" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <img 
                src="/lovable-uploads/80c72ab4-c9fc-465f-9f8a-e53c8affdd27.png" 
                alt="Game Logo" 
                className="w-32 h-32 drop-shadow-2xl premium-logo cursor-pointer"
              />
            </a>
            
            <h1 className="text-4xl md:text-7xl font-heading font-bold text-foreground mb-4 drop-shadow-lg">
              PICTURE GUESSING GAME
            </h1>
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-gold mx-auto mb-6 rounded-full shadow-lg"></div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-primary/20 shadow-lg hover:shadow-primary/10 animate-fade-in">
            ติดตามพวกเราพร้อมเพื่อน ๆ ได้ที่ช่อง YouTube: Our Usual Day เพื่อไม่พลาดกิจกรรมและเกมสนุก ๆ!
          </p>
        </div>

        {/* YouTube Hero Section */}
        <YouTubeHeroSection 
          videoId="jWH_kwAqgc8"
          title="Join Our Gaming Adventure!"
          description="Watch our latest puzzle-solving adventure and gaming highlights"
        />

        {/* Admin Controls */}
        <div className="flex justify-end mb-8 gap-4">
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Link to="/admin">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/30 transition-all duration-300">
                  <Settings className="w-4 h-4 mr-2" />
                  จัดการระบบ
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={signOut}
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                ออกจากระบบ
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowAuthModal(true)}
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              ผู้ดูแลระบบ
            </Button>
          )}
        </div>

        {/* Game Categories */}
        <Card className="bg-white/95 border-primary/10 max-w-4xl mx-auto backdrop-blur-sm shadow-lg hover:shadow-primary/10 transition-all duration-300 animate-scale-in">
          <CardContent className="p-8">
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onStartGame={() => {}} // ไม่ใช้แล้วเพราะเข้าเกมทันที
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-white/95 border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-primary/10 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-heading font-bold text-lg mb-2 text-foreground">
                หลายหมวดหมู่
              </h3>
              <p className="text-muted-foreground">
                เลือกเล่นได้หลากหลายหมวดหมู่ตามความชอบ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-primary/10 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎮</div>
              <h3 className="font-heading font-bold text-lg mb-2 text-foreground">
                ระบบคะแนน
              </h3>
              <p className="text-muted-foreground">
                เริ่มด้วย 25 คะแนน หักทีละ 5 ต่อการเปิดช่อง
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-primary/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-primary/10 animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-heading font-bold text-lg mb-2 text-foreground">
                10 เกมต่อรอบ
              </h3>
              <p className="text-muted-foreground">
                เล่น 10 เกมต่อรอบ สุ่มแบบกระจายตัวที่สุด
              </p>
            </CardContent>
          </Card>
        </div>

        {/* YouTube Feed Section */}
        <YouTubeFeedSection 
          videoId="jWH_kwAqgc8"
          title="Behind the Scenes: Creating Your Favorite Puzzle Game"
          description="Watch how we build challenging puzzles and discover the fun moments behind the game development!"
        />
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      
      {/* Floating YouTube Button */}
      <YouTubeFloatingButton 
        videoId="jWH_kwAqgc8"
        channelName="Our Usual Day"
      />
    </div>
  );
};

export default HomePage;
