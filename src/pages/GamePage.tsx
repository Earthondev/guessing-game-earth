
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Eye, Shuffle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TileGrid from "@/components/TileGrid";
import { supabase } from "@/integrations/supabase/client";

interface ImageData {
  id: string;
  imageUrl: string;
  answer: string;
}

const GamePage = () => {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [revealedTiles, setRevealedTiles] = useState<boolean[]>(Array(25).fill(false));
  const [allRevealed, setAllRevealed] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load images from Supabase
  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('masked_rider_images')
        .select('*');

      if (error) throw error;

      // Get public URLs for each image
      const imagesWithUrls = await Promise.all(
        data.map(async (img) => {
          const { data: urlData } = supabase.storage
            .from('masked-rider-images')
            .getPublicUrl(img.storage_path);
          
          return {
            id: img.id,
            imageUrl: urlData.publicUrl,
            answer: img.answer
          };
        })
      );

      setImages(imagesWithUrls);
      if (imagesWithUrls.length > 0 && !currentImage) {
        selectRandomImage(imagesWithUrls);
      }
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

  useEffect(() => {
    loadImages();
  }, []);

  const selectRandomImage = (imageList: ImageData[]) => {
    if (imageList.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * imageList.length);
    setCurrentImage(imageList[randomIndex]);
    setRevealedTiles(Array(25).fill(false));
    setAllRevealed(false);
  };

  const handleTileClick = (index: number) => {
    if (revealedTiles[index] || allRevealed) return;

    // Play sound effect
    playClickSound();

    const newRevealed = [...revealedTiles];
    newRevealed[index] = true;
    setRevealedTiles(newRevealed);
  };

  const playClickSound = () => {
    // Create a simple beep sound
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
  };

  const revealAll = () => {
    setRevealedTiles(Array(25).fill(true));
    setAllRevealed(true);
    
    toast({
      title: "เฉลย!",
      description: currentImage?.answer || "ไม่พบคำเฉลย",
    });
  };

  const resetCurrent = () => {
    setRevealedTiles(Array(25).fill(false));
    setAllRevealed(false);
    
    toast({
      title: "รีเซ็ตแล้ว",
      description: "เริ่มเกมใหม่อีกครั้ง",
    });
  };

  const nextQuestion = () => {
    if (images.length === 0) {
      toast({
        title: "ไม่มีรูปภาพ",
        description: "กรุณาเพิ่มรูปภาพในหน้าจัดการก่อน",
        variant: "destructive",
      });
      return;
    }

    selectRandomImage(images);
    
    toast({
      title: "คำถามใหม่",
      description: "เริ่มเกมใหม่!",
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-orbitron font-bold text-rider-gold">
              เกมทายภาพ
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            เปิดแล้ว {revealedCount}/25 ช่อง
          </div>
        </div>

        {/* Game Info */}
        {currentImage && (
          <Card className="admin-card mb-6">
            <CardHeader>
              <CardTitle className="text-center text-rider-red font-orbitron">
                {allRevealed ? currentImage.answer : "ทายชื่อมาสค์ไรเดอร์จากภาพ"}
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* Game Grid */}
        {currentImage ? (
          <div className="mb-8">
            <TileGrid
              imageUrl={currentImage.imageUrl}
              revealedTiles={revealedTiles}
              onTileClick={handleTileClick}
            />
          </div>
        ) : (
          <Card className="admin-card mb-8">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">ไม่มีรูปภาพสำหรับเล่น</h3>
              <p className="text-muted-foreground mb-4">
                กรุณาเพิ่มรูปภาพในหน้าจัดการก่อนเล่นเกม
              </p>
              <Link to="/admin">
                <Button className="hero-button">
                  ไปหน้าจัดการรูปภาพ
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Control Buttons */}
        {currentImage && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={revealAll}
              className="hero-button bg-rider-gold hover:bg-rider-gold/80"
            >
              <Eye className="w-4 h-4 mr-2" />
              เฉลยทั้งหมด
            </Button>
            
            <Button
              onClick={resetCurrent}
              variant="outline"
              className="border-rider-metal text-rider-metal hover:bg-rider-metal hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              รีเซ็ตปัจจุบัน
            </Button>
            
            <Button
              onClick={nextQuestion}
              className="hero-button"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              คำถามถัดไป
            </Button>
            
            <Button
              onClick={playClickSound}
              variant="outline"
              className="border-rider-gold text-rider-gold hover:bg-rider-gold hover:text-black"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              ทดสอบเสียง
            </Button>
          </div>
        )}

        {/* Stats */}
        {currentImage && (
          <Card className="admin-card mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-rider-red">{revealedCount}</div>
                  <div className="text-sm text-muted-foreground">ช่องที่เปิด</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rider-gold">{25 - revealedCount}</div>
                  <div className="text-sm text-muted-foreground">ช่องที่เหลือ</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rider-metal">{Math.round((revealedCount / 25) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">ความคืบหน้า</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{images.length}</div>
                  <div className="text-sm text-muted-foreground">รูปภาพทั้งหมด</div>
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
