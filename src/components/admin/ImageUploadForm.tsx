
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

    setLoading(true);
    try {
      const timestamp = Date.now();
      const gameImageFileName = `game_${timestamp}_${gameImageFile.name}`;
      const answerImageFileName = `answer_${timestamp}_${answerImageFile.name}`;

      // Upload game image (cropped 1:1 image for playing)
      const { error: gameUploadError } = await supabase.storage
        .from('masked-rider-images')
        .upload(gameImageFileName, gameImageFile);

      if (gameUploadError) throw gameUploadError;

      // Upload answer image (full image for reveal)
      const { error: answerUploadError } = await supabase.storage
        .from('masked-rider-images')
        .upload(answerImageFileName, answerImageFile);

      if (answerUploadError) throw answerUploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('masked_rider_images')
        .insert({
          filename: gameImageFile.name,
          storage_path: gameImageFileName, // Game image path
          original_storage_path: answerImageFileName, // Answer image path
          answer: acceptedAnswers[0], // First answer as primary
          accepted_answers: acceptedAnswers,
          category: selectedCategory
        });

      if (dbError) throw dbError;

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

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มรูปภาพได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-300 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Plus className="w-5 h-5" />
          เพิ่มรูปภาพใหม่
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-black">หมวดหมู่</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name} className="text-black hover:bg-gray-100">
                      {cat.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-black">รูปสำหรับเล่นเกม (1:1)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleGameImageSelect}
                className="cursor-pointer bg-white border-gray-300 text-black"
              />
              <p className="text-xs text-gray-500 mt-1">รูปที่ครอปเป็นสี่เหลี่ยมจัตุรัส</p>
            </div>

            <div>
              <Label className="text-black">รูปเฉลย (รูปเต็ม)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAnswerImageSelect}
                className="cursor-pointer bg-white border-gray-300 text-black"
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
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "กำลังบันทึก..." : "บันทึกรูปภาพ"}
            </Button>
          </div>

          <div className="space-y-4">
            {gameImagePreview && (
              <div>
                <Label className="text-black">ตัวอย่างรูปเล่นเกม</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="w-48 h-48 mx-auto border border-gray-300 rounded-lg overflow-hidden">
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
                <Label className="text-black">ตัวอย่างรูปเฉลย</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="w-48 h-auto mx-auto border border-gray-300 rounded-lg overflow-hidden">
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
