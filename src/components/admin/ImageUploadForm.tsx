
import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import MultiAnswerInput from "@/components/MultiAnswerInput";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadFormProps {
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onImageUploaded: () => void;
}

const ImageUploadForm = ({ categories, selectedCategory, setSelectedCategory, onImageUploaded }: ImageUploadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [gameImageFile, setGameImageFile] = useState<File | null>(null);
  const [answerImageFile, setAnswerImageFile] = useState<File | null>(null);
  const [gameImagePreview, setGameImagePreview] = useState<string>("");
  const [answerImagePreview, setAnswerImagePreview] = useState<string>("");
  const [acceptedAnswers, setAcceptedAnswers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGameImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
          variant: "destructive",
        });
        return;
      }

      setGameImageFile(file);
      const url = URL.createObjectURL(file);
      setGameImagePreview(url);
    }
  };

  const handleAnswerImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
          variant: "destructive",
        });
        return;
      }

      setAnswerImageFile(file);
      const url = URL.createObjectURL(file);
      setAnswerImagePreview(url);
    }
  };

  const uploadImage = async () => {
    if (!gameImageFile || !answerImageFile || acceptedAnswers.length === 0) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "เลือกรูปเล่นเกม, รูปเฉลย และใส่คำตอบอย่างน้อย 1 คำ",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (gameImageFile.size > maxSize || answerImageFile.size > maxSize) {
      toast({
        title: "ไฟล์ใหญ่เกินไป",
        description: "ขนาดไฟล์รูปภาพต้องไม่เกิน 10MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const timestamp = Date.now();
      // Sanitize filename - remove special characters that may cause issues
      const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const gameImageFileName = `game_${timestamp}_${sanitize(gameImageFile.name)}`;
      const answerImageFileName = `answer_${timestamp}_${sanitize(answerImageFile.name)}`;

      console.log('Uploading game image:', gameImageFileName, 'size:', gameImageFile.size);

      // Upload game image (cropped 1:1 image for playing)
      const { error: gameUploadError, data: gameData } = await supabase.storage
        .from('masked-rider-images')
        .upload(gameImageFileName, gameImageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (gameUploadError) {
        console.error('Game image upload error:', gameUploadError);
        toast({
          title: "อัปโหลดรูปเล่นเกมไม่สำเร็จ",
          description: gameUploadError.message || "ไม่สามารถอัปโหลดรูปเล่นเกมได้",
          variant: "destructive",
        });
        return;
      }
      console.log('Game image uploaded successfully:', gameData);

      // Upload answer image (full image for reveal)
      console.log('Uploading answer image:', answerImageFileName, 'size:', answerImageFile.size);
      const { error: answerUploadError, data: answerData } = await supabase.storage
        .from('masked-rider-images')
        .upload(answerImageFileName, answerImageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (answerUploadError) {
        console.error('Answer image upload error:', answerUploadError);
        toast({
          title: "อัปโหลดรูปเฉลยไม่สำเร็จ",
          description: answerUploadError.message || "ไม่สามารถอัปโหลดรูปเฉลยได้",
          variant: "destructive",
        });
        return;
      }
      console.log('Answer image uploaded successfully:', answerData);

      // Save metadata to database
      console.log('Saving to database:', { storage_path: gameImageFileName, original_storage_path: answerImageFileName, answer: acceptedAnswers[0], category: selectedCategory });
      const { error: dbError } = await supabase
        .from('masked_rider_images')
        .insert({
          storage_path: gameImageFileName, // Game image path
          original_storage_path: answerImageFileName, // Answer image path
          answer: acceptedAnswers[0], // First answer as primary
          accepted_answers: acceptedAnswers,
          category: selectedCategory
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        toast({
          title: "บันทึกข้อมูลไม่สำเร็จ",
          description: dbError.message || "ไม่สามารถบันทึกข้อมูลรูปภาพลงฐานข้อมูลได้",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "เพิ่มรูปภาพสำเร็จ",
        description: `เพิ่มรูปภาพในหมวดหมู่ ${categories.find(c => c.name === selectedCategory)?.display_name} แล้ว`,
      });

      // Reset form
      setGameImageFile(null);
      setAnswerImageFile(null);
      setGameImagePreview("");
      setAnswerImagePreview("");
      setAcceptedAnswers([]);
      onImageUploaded();

    } catch (error: any) {
      console.error('Error uploading image (full):', error);
      const errorMsg = error?.message || error?.error_description || JSON.stringify(error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถเพิ่มรูปภาพได้: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="luxury-card border-gold/20 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold">
          <Plus className="w-5 h-5" />
          เพิ่มรูปภาพใหม่
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">หมวดหมู่</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-rich-black-lighter border-gold/20 text-white hover:border-gold/40 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-rich-black border-gold/20 z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name} className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                      {cat.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">รูปสำหรับเล่นเกม (1:1)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleGameImageSelect}
                className="cursor-pointer bg-rich-black-lighter border-gold/20 text-white file:bg-luxury-red file:border-0 file:text-white file:mr-4 file:px-4 file:py-2 file:rounded-full file:text-sm file:font-semibold hover:file:bg-luxury-red-vivid transition-colors"
                style={{ height: 'auto', padding: '0.5rem' }}
              />
              <p className="text-xs text-gray-500 mt-1">รูปที่ครอปเป็นสี่เหลี่ยมจัตุรัส</p>
            </div>

            <div>
              <Label className="text-gray-300">รูปเฉลย (รูปเต็ม)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAnswerImageSelect}
                className="cursor-pointer bg-rich-black-lighter border-gold/20 text-white file:bg-luxury-red file:border-0 file:text-white file:mr-4 file:px-4 file:py-2 file:rounded-full file:text-sm file:font-semibold hover:file:bg-luxury-red-vivid transition-colors"
                style={{ height: 'auto', padding: '0.5rem' }}
              />
              <p className="text-xs text-gray-500 mt-1">รูปต้นฉบับสำหรับแสดงเฉลย</p>
            </div>

            <MultiAnswerInput
              answers={acceptedAnswers}
              onChange={setAcceptedAnswers}
              label="คำตอบที่ยอมรับได้ (ไทย/อังกฤษ)"
            />

            <Button
              onClick={uploadImage}
              disabled={loading || !gameImageFile || !answerImageFile || acceptedAnswers.length === 0}
              className="luxury-button w-full mt-4"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "กำลังบันทึก..." : "บันทึกรูปภาพ"}
            </Button>
          </div>

          <div className="space-y-4">
            {gameImagePreview && (
              <div>
                <Label className="text-gray-300">ตัวอย่างรูปเล่นเกม</Label>
                <div className="border border-gold/20 rounded-lg p-4 bg-rich-black-lighter">
                  <div className="w-48 h-48 mx-auto border border-white/10 rounded-lg overflow-hidden">
                    <img
                      src={gameImagePreview}
                      alt="Game image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {answerImagePreview && (
              <div>
                <Label className="text-gray-300">ตัวอย่างรูปเฉลย</Label>
                <div className="border border-gold/20 rounded-lg p-4 bg-rich-black-lighter">
                  <div className="w-48 h-auto mx-auto border border-white/10 rounded-lg overflow-hidden">
                    <img
                      src={answerImagePreview}
                      alt="Answer image preview"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadForm;
