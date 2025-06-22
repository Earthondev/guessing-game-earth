
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, Eye, Shuffle, Volume2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TileGrid from "@/components/TileGrid";
import GameTimer from "@/components/GameTimer";
import { supabase } from "@/integrations/supabase/client";

interface ImageData {
  id: string;
  imageUrl: string;
  answer: string;
  originalImageUrl?: string;
}

const GamePage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'masked_rider';
  
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [revealedTiles, setRevealedTiles] = useState<boolean[]>(Array(25).fill(false));
  const [allRevealed, setAllRevealed] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentRoundImages, setCurrentRoundImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { toast } = useToast();

  const getCategoryDisplayName = (cat: string) => {
    const categories: { [key: string]: string } = {
      'masked_rider': 'มาสค์ไรเดอร์',
      'thai_celebrities': 'ดาราไทย',
      'thai_movies': 'หนังไทย'
    };
    return categories[cat] || 'ไม่ทราบหมวดหมู่';
  };

  // Enhanced loadImages function to get images by category
  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('masked_rider_images')
        .select('*')
        .eq('category', category);

      if (error) throw error;

      // Get public URLs for each image (both cropped and original)
      const imagesWithUrls = await Promise.all(
        data.map(async (img) => {
          const { data: croppedUrlData } = supabase.storage
            .from('masked-rider-images')
            .getPublicUrl(img.storage_path);
          
          let originalImageUrl = croppedUrlData.publicUrl;
          
          // Get original image URL if exists
          if (img.original_storage_path) {
            const { data: originalUrlData } = supabase.storage
              .from('masked-rider-images')
              .getPublicUrl(img.original_storage_path);
            originalImageUrl = originalUrlData.publicUrl;
          }
          
          return {
            id: img.id,
            imageUrl: croppedUrlData.publicUrl,
            originalImageUrl: originalImageUrl,
            answer: img.answer
          };
        })
      );

      if (imagesWithUrls.length === 0) {
        toast({
          title: "ไม่มีรูปภาพ",
          description: `ไม่พบรูปภาพในหมวดหมู่ ${getCategoryDisplayName(category)}`,
          variant: "destructive",
        });
        setImages([]);
        return;
      }

      setImages(imagesWithUrls);
      startNewRound(imagesWithUrls);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดรูปภาพได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewRound = (imageList: ImageData[]) => {
    if (imageList.length === 0) return;
    
    // Select up to 10 random unique images for this round
    const shuffled = [...imageList].sort(() => Math.random() - 0.5);
    const roundImages = shuffled.slice(0, Math.min(10, imageList.length));
    
    setCurrentRoundImages(roundImages);
    setCurrentImageIndex(0);
    setCurrentImage(roundImages[0]);
    setRevealedTiles(Array(25).fill(false));
    setAllRevealed(false);
    setShowOriginal(false);
    setTimerActive(true);
    setQuestionsAnswered(0);
  };

  useEffect(() => {
    loadImages();
  }, [category]);

  const handleTileClick = (index: number) => {
    if (revealedTiles[index] || allRevealed) return;

    playClickSound();

    const newRevealed = [...revealedTiles];
    newRevealed[index] = true;
    setRevealedTiles(newRevealed);
  };

  const playClickSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const revealAll = () => {
    setRevealedTiles(Array(25).fill(true));
    setAllRevealed(true);
    setShowOriginal(true);
    setTimerActive(false);
    
    // Calculate score based on revealed tiles
    const revealedCount = revealedTiles.filter(Boolean).length;
    const points = Math.max(0, 25 - revealedCount);
    setScore(prev => prev + points);
    
    setTimeout(() => {
      toast({
        title: "🎉 เฉลย!",
        description: `${currentImage?.answer || "ไม่พบคำเฉลย"} - ได้ ${points} คะแนน`,
      });
    }, 500);
  };

  const nextQuestion = () => {
    if (currentRoundImages.length === 0) {
      startNewRound(images);
      return;
    }

    const nextIndex = currentImageIndex + 1;
    
    if (nextIndex >= currentRoundImages.length) {
      // End of round
      toast({
        title: "🏁 จบรอบ!",
        description: `คะแนนรวม: ${score} คะแนน จาก ${questionsAnswered + 1} คำถาม`,
      });
      
      setTimeout(() => {
        startNewRound(images);
      }, 2000);
      return;
    }

    setCurrentImageIndex(nextIndex);
    setCurrentImage(currentRoundImages[nextIndex]);
    setRevealedTiles(Array(25).fill(false));
    setAllRevealed(false);
    setShowOriginal(false);
    setTimerActive(true);
    setQuestionsAnswered(prev => prev + 1);
    
    toast({
      title: "🔄 คำถามถัดไป",
      description: `คำถามที่ ${nextIndex + 1}/${currentRoundImages.length}`,
    });
  };

  const handleTimeUp = () => {
    if (!allRevealed) {
      revealAll();
      toast({
        title: "⏰ หมดเวลา!",
        description: "เวลาหมดแล้ว เฉลยอัตโนมัติ",
        variant: "destructive",
      });
    }
  };

  const resetCurrent = () => {
    setRevealedTiles(Array(25).fill(false));
    setAllRevealed(false);
    setShowOriginal(false);
    setTimerActive(true);
    
    toast({
      title: "รีเซ็ตแล้ว",
      description: "เริ่มคำถามนี้ใหม่อีกครั้ง",
    });
  };

  const revealedCount = revealedTiles.filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="admin-card">
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-rider-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลดรูปภาพ...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="hover:scale-105 transition-transform">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <div className="animate-fade-in">
              <h1 className="text-3xl font-orbitron font-bold text-rider-gold">
                {getCategoryDisplayName(category)}
              </h1>
              <p className="text-sm text-muted-foreground">
                คำถามที่ {currentImageIndex + 1}/{currentRoundImages.length} | คะแนน: {score}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <GameTimer
              isActive={timerActive}
              onTimeUp={handleTimeUp}
              duration={60}
            />
            <div className="text-sm text-muted-foreground animate-pulse">
              เปิดแล้ว <span className="text-rider-gold font-bold">{revealedCount}</span>/25 ช่อง
            </div>
          </div>
        </div>

        {/* Enhanced Game Info with Transition */}
        {currentImage && (
          <Card className="admin-card mb-6 transition-all duration-500 hover:border-rider-gold">
            <CardHeader>
              <CardTitle className={`text-center font-orbitron transition-all duration-700 ${
                allRevealed ? 'text-rider-gold animate-glow-pulse' : 'text-rider-red'
              }`}>
                <div className="transition-all duration-500 transform">
                  {allRevealed ? (
                    <div className="animate-scale-in">
                      🎉 เฉลย: {currentImage.answer}
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      ทายจากภาพนี้
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* Enhanced Game Display */}
        {currentImage ? (
          <div className="mb-8">
            {showOriginal && allRevealed ? (
              // Show original full image when revealed
              <Card className="admin-card border-rider-gold bg-gradient-to-br from-black to-rider-black-light animate-scale-in">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-rider-gold animate-fade-in">
                      🖼️ รูปต้นฉบับเต็ม
                    </h3>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <img
                      src={currentImage.originalImageUrl || currentImage.imageUrl}
                      alt={currentImage.answer}
                      className="w-full max-h-96 object-contain mx-auto animate-fade-in"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
                    {/* Answer moved to bottom */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-rider-gold text-black px-6 py-3 rounded-full font-bold text-lg animate-float">
                        {currentImage.answer}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Show tile grid for gameplay
              <div className="transition-all duration-500">
                <TileGrid
                  imageUrl={currentImage.imageUrl}
                  revealedTiles={revealedTiles}
                  onTileClick={handleTileClick}
                />
              </div>
            )}
          </div>
        ) : (
          <Card className="admin-card">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-bold text-muted-foreground mb-4">
                ไม่มีรูปภาพในหมวดหมู่นี้
              </h3>
              <p className="text-muted-foreground mb-6">
                กรุณาเพิ่มรูปภาพในหมวดหมู่ {getCategoryDisplayName(category)} ก่อนเริ่มเล่นเกม
              </p>
              <Link to="/">
                <Button className="hero-button mr-4">
                  กลับหน้าหลัก
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Control Buttons */}
        {currentImage && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={revealAll}
              className="hero-button bg-rider-gold hover:bg-rider-gold/80 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shine"></div>
              <Eye className="w-4 h-4 mr-2" />
              เฉลยทั้งหมด
            </Button>
            
            <Button
              onClick={resetCurrent}
              variant="outline"
              className="border-rider-metal text-rider-metal hover:bg-rider-metal hover:text-white hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              รีเซ็ตปัจจุบัน
            </Button>
            
            <Button
              onClick={nextQuestion}
              className="hero-button hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rider-red via-rider-red-dark to-rider-red opacity-20 animate-shine"></div>
              <Shuffle className="w-4 h-4 mr-2" />
              คำถามถัดไป
            </Button>
            
            <Button
              onClick={playClickSound}
              variant="outline"
              className="border-rider-gold text-rider-gold hover:bg-rider-gold hover:text-black hover:scale-105 transition-all duration-300"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              ทดสอบเสียง
            </Button>
          </div>
        )}

        {/* Enhanced Stats Card */}
        {currentImage && (
          <Card className="admin-card mt-8 bg-gradient-to-br from-rider-black to-rider-black-light border-rider-metal">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-rider-red animate-pulse">{revealedCount}</div>
                  <div className="text-sm text-muted-foreground">ช่องที่เปิด</div>
                </div>
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-rider-gold">{25 - revealedCount}</div>
                  <div className="text-sm text-muted-foreground">ช่องที่เหลือ</div>
                </div>
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-rider-metal">{Math.round((revealedCount / 25) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">ความคืบหน้า</div>
                </div>
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-white">{score}</div>
                  <div className="text-sm text-muted-foreground">คะแนนรวม</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GamePage;
