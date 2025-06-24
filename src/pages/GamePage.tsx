import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, Eye, Shuffle, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TileGrid from "@/components/TileGrid";
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
  const [currentRoundImages, setCurrentRoundImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(25);
  const [totalScore, setTotalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [categoryDisplayName, setCategoryDisplayName] = useState('');
  const { toast } = useToast();

  const getCategoryDisplayName = async (cat: string) => {
    try {
      const { data } = await supabase
        .from('game_categories')
        .select('display_name')
        .eq('name', cat)
        .maybeSingle();
      
      return data?.display_name || 'ไม่ทราบหมวดหมู่';
    } catch {
      return 'ไม่ทราบหมวดหมู่';
    }
  };

  useEffect(() => {
    getCategoryDisplayName(category).then(setCategoryDisplayName);
  }, [category]);

  const loadImages = async () => {
    setLoading(true);
    try {
      // First, get category information
      const { data: categoryData } = await supabase
        .from('game_categories')
        .select('*')
        .eq('name', category)
        .maybeSingle();

      if (!categoryData) {
        toast({
          title: "ไม่พบหมวดหมู่",
          description: `ไม่พบหมวดหมู่ ${category} ในระบบ`,
          variant: "destructive",
        });
        return;
      }

      // Then get images for this category
      const { data: imagesData, error } = await supabase
        .from('masked_rider_images')
        .select('*')
        .eq('category', category);

      if (error) {
        console.error('Error loading images:', error);
        throw error;
      }

      if (!imagesData || imagesData.length === 0) {
        toast({
          title: "ไม่มีรูปภาพ",
          description: `ไม่พบรูปภาพในหมวดหมู่ ${categoryDisplayName}`,
          variant: "destructive",
        });
        return;
      }

      // Process images and get public URLs
      const imagesWithUrls = await Promise.all(
        imagesData.map(async (img) => {
          try {
            // Get cropped image URL
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
          } catch (error) {
            console.error('Error processing image:', img.filename, error);
            return null;
          }
        })
      );

      // Filter out any failed image processing and ensure we have valid ImageData objects
      const validImages = imagesWithUrls.filter((img): img is ImageData => {
        return img !== null && 
               typeof img.id === 'string' && 
               typeof img.imageUrl === 'string' && 
               typeof img.answer === 'string';
      });

      if (validImages.length === 0) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดรูปภาพได้",
          variant: "destructive",
        });
        return;
      }

      startNewGame(validImages);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลเกมได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewGame = (imageList: ImageData[]) => {
    if (imageList.length === 0) return;
    
    // Select exactly 5 random unique images for this game
    const shuffled = [...imageList].sort(() => Math.random() - 0.5);
    const gameImages = shuffled.slice(0, Math.min(5, imageList.length));
    
    setCurrentRoundImages(gameImages);
    setCurrentImageIndex(0);
    setCurrentImage(gameImages[0]);
    setRevealedTiles(Array(25).fill(false));
    setAllRevealed(false);
    setShowOriginal(false);
    setScore(25);
    setTotalScore(0);
    setQuestionsAnswered(0);
    setGameCompleted(false);
  };

  useEffect(() => {
    loadImages();
  }, [category]);

  const handleTileClick = (index: number) => {
    if (revealedTiles[index] || allRevealed) return;

    const newRevealed = [...revealedTiles];
    newRevealed[index] = true;
    setRevealedTiles(newRevealed);
    
    // Decrease score by 5 for each tile revealed
    setScore(prev => Math.max(0, prev - 5));
  };

  const handleCorrectAnswer = () => {
    if (allRevealed) return;

    setAllRevealed(true);
    setShowOriginal(true);
    setTotalScore(prev => prev + score);
    
    toast({
      title: "🎉 ถูกต้อง!",
      description: `${currentImage?.answer || "ไม่พบคำเฉลย"} - ได้ ${score} คะแนน`,
    });

    setTimeout(() => {
      if (currentImageIndex + 1 >= currentRoundImages.length) {
        // Game completed
        setGameCompleted(true);
        toast({
          title: "🏁 จบเกม!",
          description: `คะแนนรวม: ${totalScore + score} คะแนน จาก 5 คำถาม`,
        });
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const revealAll = () => {
    setRevealedTiles(Array(25).fill(true));
    setAllRevealed(true);
    setShowOriginal(true);
    setScore(0); // No points when revealing
    
    setTimeout(() => {
      toast({
        title: "📖 เฉลย!",
        description: `${currentImage?.answer || "ไม่พบคำเฉลย"} - ได้ 0 คะแนน`,
      });
      
      if (currentImageIndex + 1 >= currentRoundImages.length) {
        // Game completed
        setGameCompleted(true);
        toast({
          title: "🏁 จบเกม!",
          description: `คะแนนรวม: ${totalScore} คะแนน จาก 5 คำถาม`,
        });
      } else {
        setTimeout(() => nextQuestion(), 1500);
      }
    }, 500);
  };

  const nextQuestion = () => {
    const nextIndex = currentImageIndex + 1;
    
    setCurrentImageIndex(nextIndex);
    setCurrentImage(currentRoundImages[nextIndex]);
    setRevealedTiles(Array(25).fill(false));
    setAllRevealed(false);
    setShowOriginal(false);
    setScore(25); // Reset score for new question
    setQuestionsAnswered(prev => prev + 1);
  };

  const resetGame = () => {
    loadImages();
  };

  const revealedCount = revealedTiles.filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gray-100">
        <Card className="bg-white border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black">กำลังโหลดรูปภาพ...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="hover:scale-105 transition-transform border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-black">
                {categoryDisplayName}
              </h1>
              <p className="text-sm text-gray-600">
                {gameCompleted ? 'เกมจบแล้ว' : `คำถามที่ ${currentImageIndex + 1}/5`} | คะแนนรวม: {totalScore + (gameCompleted ? 0 : score)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              คะแนนคำถามนี้: <span className="text-blue-600 font-bold">{score}</span>
            </div>
            <div className="text-sm text-gray-600">
              เปิดแล้ว <span className="text-blue-600 font-bold">{revealedCount}</span>/25 ช่อง
            </div>
          </div>
        </div>

        {/* Game Info */}
        {currentImage && !gameCompleted && (
          <Card className="bg-white border-gray-300 mb-6">
            <CardHeader>
              <CardTitle className={`text-center font-bold transition-all duration-700 ${
                allRevealed ? 'text-green-600' : 'text-blue-600'
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

        {/* Game Completed Screen */}
        {gameCompleted && (
          <Card className="bg-white border-gray-300 mb-6">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">🏁 เกมจบแล้ว!</h2>
              <p className="text-xl text-black mb-4">คะแนนรวม: {totalScore} / 125 คะแนน</p>
              <p className="text-gray-600 mb-6">
                {totalScore >= 100 ? "🌟 ยอดเยี่ยม! คุณรู้จักหมวดหมู่นี้ดีมาก!" :
                 totalScore >= 75 ? "👍 ดีมาก! คุณมีความรู้ในระดับดี" :
                 totalScore >= 50 ? "😊 พอใช้! ลองเล่นอีกครั้งเพื่อพัฒนา" :
                 "💪 ลองใหม่อีกครั้ง! ฝึกฝนแล้วจะเก่งขึ้น"}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={resetGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  เล่นใหม่
                </Button>
                <Link to="/">
                  <Button variant="outline" className="border-gray-400 text-gray-600 hover:bg-gray-100">
                    <Home className="w-4 h-4 mr-2" />
                    กลับหน้าหลัก
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Display */}
        {currentImage && !gameCompleted ? (
          <div className="mb-8">
            {showOriginal && allRevealed ? (
              // Show original full image when revealed
              <Card className="bg-white border-green-500">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-green-600">
                      🖼️ รูปต้นฉบับเต็ม
                    </h3>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={currentImage.originalImageUrl || currentImage.imageUrl}
                      alt={currentImage.answer}
                      className="w-full max-h-96 object-contain mx-auto"
                      onError={(e) => {
                        console.error('Error loading original image:', e);
                        // Fallback to cropped image if original fails
                        (e.target as HTMLImageElement).src = currentImage.imageUrl;
                      }}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg">
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
        ) : null}

        {/* Control Buttons */}
        {currentImage && !gameCompleted && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              onClick={handleCorrectAnswer}
              disabled={allRevealed}
              className="bg-green-500 hover:bg-green-600 text-white hover:scale-105 transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              ถูกต้อง!
            </Button>
            
            <Button
              onClick={revealAll}
              disabled={allRevealed}
              className="bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 transition-all duration-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              เฉลย (0 คะแนน)
            </Button>
            
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-gray-400 text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              เล่นใหม่
            </Button>
          </div>
        )}

        {/* Stats Card */}
        {currentImage && !gameCompleted && (
          <Card className="bg-white border-gray-300 mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-blue-600">{revealedCount}</div>
                  <div className="text-sm text-gray-600">ช่องที่เปิด</div>
                </div>
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-green-600">{25 - revealedCount}</div>
                  <div className="text-sm text-gray-600">ช่องที่เหลือ</div>
                </div>
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-600">คะแนนคำถามนี้</div>
                </div>
                <div className="transform hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-black">{totalScore}</div>
                  <div className="text-sm text-gray-600">คะแนนรวม</div>
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
