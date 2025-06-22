
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Shield, Plus, Trash2 } from "lucide-react";
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
            color: "green-500",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/79f392db-4e14-419b-9565-aed7b93b363b.png" 
              alt="Game Logo" 
              className="w-24 h-24 rounded-full"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-green-400 mb-4 animate-text-glow">
            Tile Puzzle Platform
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            แพลตฟอร์มเกมทายภาพอเนกประสงค์ ท้าทายสมองและความจำของคุณ
          </p>
        </div>

        {/* Admin Controls */}
        <div className="flex justify-end mb-8 gap-4">
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Link to="/admin">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  จัดการระบบ
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={signOut}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                ออกจากระบบ
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowAuthModal(true)}
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              ผู้ดูแลระบบ
            </Button>
          )}
        </div>

        {/* Game Categories */}
        <Card className="bg-slate-800/50 border-green-400/30 max-w-4xl mx-auto backdrop-blur-sm">
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
          <Card className="bg-slate-800/50 border-green-400/30 hover:border-green-400 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-green-400">
                หลายหมวดหมู่
              </h3>
              <p className="text-slate-300">
                เลือกเล่นได้หลากหลายหมวดหมู่ตามความชอบ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-400/30 hover:border-green-400 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-green-400">
                ระบบจับเวลา
              </h3>
              <p className="text-slate-300">
                เพิ่มความท้าทายด้วยการจับเวลา
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-400/30 hover:border-green-400 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-green-400">
                ครอปภาพอัจฉริยะ
              </h3>
              <p className="text-slate-300">
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
