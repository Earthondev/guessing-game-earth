
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Shield, Youtube } from "lucide-react";
import CategorySelector, { GameCategory } from "@/components/CategorySelector";
import AuthModal from "@/components/AuthModal";
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
            id: category.id,
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

  const handleStartGame = () => {
    if (selectedCategory) {
      window.location.href = `/game?category=${selectedCategory}`;
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleYouTubeClick = () => {
    window.open('https://www.youtube.com/@OurUsualDay', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 gap-6">
            {/* New Game Logo */}
            <img 
              src="/lovable-uploads/580a407f-6e75-45a1-a4d9-2d9c72133045.png" 
              alt="Game Logo" 
              className="w-20 h-20 drop-shadow-2xl"
            />
            
            {/* YouTube Icons */}
            <div className="flex items-center gap-3">
              <Youtube 
                className="w-10 h-10 text-red-500 cursor-pointer hover:text-red-400 transition-colors drop-shadow-lg" 
                onClick={handleYouTubeClick}
              />
              <img 
                src="/lovable-uploads/79f392db-4e14-419b-9565-aed7b93b363b.png" 
                alt="Channel Logo" 
                className="w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
                onClick={handleYouTubeClick}
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-orbitron font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-4 animate-text-glow drop-shadow-2xl">
            TILE PUZZLE PLATFORM
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto mb-6 rounded-full shadow-lg"></div>
          <p 
            className="text-xl text-red-100 max-w-2xl mx-auto cursor-pointer hover:text-red-300 transition-colors leading-relaxed bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-red-500/30"
            onClick={handleYouTubeClick}
          >
            ติดตามพวกเราพร้อมเพื่อน ๆ ได้ที่ช่อง YouTube: Our Usual Day เพื่อไม่พลาดกิจกรรมและเกมสนุก ๆ!
          </p>
        </div>

        {/* Admin Controls */}
        <div className="flex justify-end mb-8 gap-4">
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Link to="/admin">
                <Button className="bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-lg">
                  <Settings className="w-4 h-4 mr-2" />
                  จัดการระบบ
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={signOut}
                className="border-red-500 text-red-300 hover:bg-red-600 hover:text-white bg-black/30 backdrop-blur-sm"
              >
                ออกจากระบบ
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowAuthModal(true)}
              className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white bg-black/30 backdrop-blur-sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              ผู้ดูแลระบบ
            </Button>
          )}
        </div>

        {/* Game Categories */}
        <Card className="bg-black/40 border-red-500/50 max-w-4xl mx-auto backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8">
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onStartGame={handleStartGame}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-black/40 border-red-500/50 hover:border-red-400 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-red-400">
                หลายหมวดหมู่
              </h3>
              <p className="text-red-100">
                เลือกเล่นได้หลากหลายหมวดหมู่ตามความชอบ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/50 hover:border-red-400 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎮</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-red-400">
                ระบบคะแนน
              </h3>
              <p className="text-red-100">
                เริ่มด้วย 25 คะแนน หักทีละ 5 ต่อการเปิดช่อง
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/50 hover:border-red-400 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-red-400">
                ครอปภาพอัจฉริยะ
              </h3>
              <p className="text-red-100">
                ตัดแต่งภาพให้ได้ความยากที่เหมาะสม
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default HomePage;
