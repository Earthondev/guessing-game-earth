
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Play, Shield } from "lucide-react";
import CategorySelector, { GameCategory } from "@/components/CategorySelector";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<GameCategory[]>([]);
  const { isAuthenticated, signOut } = useAuth();

  const defaultCategories: GameCategory[] = [
    {
      id: "masked_rider",
      name: "masked_rider",
      displayName: "มาสค์ไรเดอร์",
      description: "ทายชื่อมาสค์ไรเดอร์จากภาพ",
      icon: "🦸",
      color: "rider-gold"
    },
    {
      id: "thai_celebrities",
      name: "thai_celebrities", 
      displayName: "ดาราไทย",
      description: "ทายชื่อดาราไทยจากภาพ",
      icon: "⭐",
      color: "pink-500"
    },
    {
      id: "thai_movies",
      name: "thai_movies",
      displayName: "หนังไทย", 
      description: "ทายชื่อหนังไทยจากโปสเตอร์",
      icon: "🎬",
      color: "blue-500"
    }
  ];

  useEffect(() => {
    loadAvailableCategories();
  }, []);

  const loadAvailableCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('masked_rider_images')
        .select('category');

      if (error) throw error;

      // Get unique categories from the data
      const uniqueCategories = [...new Set(data?.map(item => item.category) || ['masked_rider'])];
      const filtered = defaultCategories.filter(cat => 
        uniqueCategories.includes(cat.name)
      );
      
      setAvailableCategories(filtered.length > 0 ? filtered : [defaultCategories[0]]);
    } catch (error) {
      console.error('Error loading categories:', error);
      setAvailableCategories([defaultCategories[0]]);
    }
  };

  const handleStartGame = () => {
    if (selectedCategory) {
      // Navigate to game page with selected category
      window.location.href = `/game?category=${selectedCategory}`;
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rider-black via-rider-black-light to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-rider-gold rounded-full flex items-center justify-center text-2xl font-bold text-black">
              🧩
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-rider-gold mb-4 animate-glow-pulse">
            Tile Puzzle Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            แพลตฟอร์มเกมทายภาพอเนกประสงค์ ท้าทายสมองและความจำของคุณ
          </p>
        </div>

        {/* Admin Controls */}
        <div className="flex justify-end mb-8 gap-4">
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Link to="/admin">
                <Button className="hero-button">
                  <Settings className="w-4 h-4 mr-2" />
                  จัดการระบบ
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={signOut}
                className="border-rider-metal text-rider-metal hover:bg-rider-metal hover:text-white"
              >
                ออกจากระบบ
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowAuthModal(true)}
              className="border-rider-gold text-rider-gold hover:bg-rider-gold hover:text-black"
            >
              <Shield className="w-4 h-4 mr-2" />
              ผู้ดูแลระบบ
            </Button>
          )}
        </div>

        {/* Game Categories */}
        <Card className="admin-card max-w-4xl mx-auto">
          <CardContent className="p-8">
            <CategorySelector
              categories={availableCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onStartGame={handleStartGame}
            />
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="admin-card hover:border-rider-gold transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-rider-gold">
                หลายหมวดหมู่
              </h3>
              <p className="text-muted-foreground">
                เลือกเล่นได้หลากหลายหมวดหมู่ตามความชอบ
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card hover:border-rider-gold transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-rider-gold">
                ระบบจับเวลา
              </h3>
              <p className="text-muted-foreground">
                เพิ่มความท้าทายด้วยการจับเวลา
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card hover:border-rider-gold transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-orbitron font-bold text-lg mb-2 text-rider-gold">
                ครอปภาพอัจฉริยะ
              </h3>
              <p className="text-muted-foreground">
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
