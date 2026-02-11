
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Shield, HelpCircle, Youtube } from "lucide-react";
import CategorySelector, { GameCategory } from "@/components/CategorySelector";
import AuthModal from "@/components/AuthModal";
import HowToPlayModal from "@/components/HowToPlayModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
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
            id: category.name,
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

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/game?category=${categoryId}`);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact Top Bar */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="https://www.youtube.com/@OurUsualday"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110 shrink-0"
            >
              <img
                src="/lovable-uploads/80c72ab4-c9fc-465f-9f8a-e53c8affdd27.png"
                alt="Game Logo"
                className="w-10 h-10 drop-shadow-lg"
              />
            </a>
            <h1 className="text-lg md:text-xl font-heading font-bold text-gold tracking-wide">
              Picture Guessing Game
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHowToPlay(true)}
              className="text-gray-400 hover:text-gold hover:bg-white/5 transition-colors gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">วิธีเล่น</span>
            </Button>

            {isAuthenticated ? (
              <div className="flex gap-1.5">
                <Link to="/admin">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gold hover:bg-white/5">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={signOut}
                  className="text-gray-400 hover:text-red-400 hover:bg-white/5 text-xs"
                >
                  ออก
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-gray-500 hover:text-gray-300 hover:bg-white/5"
              >
                <Shield className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Game Content — centered vertically */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Minimal Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <img
                src="/lovable-uploads/80c72ab4-c9fc-465f-9f8a-e53c8affdd27.png"
                alt="Game Logo"
                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl premium-logo"
              />
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-2 tracking-wide">
              เลือกหมวดหมู่แล้วเล่นเลย!
            </h2>
            <p className="text-gray-400 font-light text-sm md:text-base max-w-md mx-auto">
              เปิดแผ่นป้ายทีละใบ ยิ่งเปิดน้อยยิ่งได้คะแนนเยอะ — เล่นได้ 10 เกมต่อรอบ
            </p>
          </div>

          {/* Category Grid — the star of the page */}
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onStartGame={() => { }}
            loading={loading}
          />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 font-light">
            เกมทายรูปภาพ — สนุกได้ทุกวัน
          </p>
          <a
            href="https://www.youtube.com/@OurUsualday"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors group"
          >
            <Youtube className="w-4 h-4 group-hover:text-red-400 transition-colors" />
            <span>Our Usual Day</span>
          </a>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
};

export default HomePage;
