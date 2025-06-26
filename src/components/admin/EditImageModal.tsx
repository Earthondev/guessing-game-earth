
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import MultiAnswerInput from "@/components/MultiAnswerInput";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface ImageItem {
  id: string;
  filename: string;
  answer: string;
  storage_path: string;
  original_storage_path?: string;
  category: string;
  imageUrl: string;
  originalImageUrl?: string;
  accepted_answers: string[];
}

interface EditImageModalProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  categories: any[];
}

const EditImageModal = ({ image, isOpen, onClose, onUpdate, categories }: EditImageModalProps) => {
  const [loading, setLoading] = useState(false);
  const [acceptedAnswers, setAcceptedAnswers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newGameImageFile, setNewGameImageFile] = useState<File | null>(null);
  const [newAnswerImageFile, setNewAnswerImageFile] = useState<File | null>(null);
  const [gameImagePreview, setGameImagePreview] = useState<string>("");
  const [answerImagePreview, setAnswerImagePreview] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (image) {
      setAcceptedAnswers(image.accepted_answers || [image.answer]);
      setSelectedCategory(image.category);
      setNewGameImageFile(null);
      setNewAnswerImageFile(null);
      setGameImagePreview("");
      setAnswerImagePreview("");
    }
  }, [image]);

  const handleGameImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewGameImageFile(file);
      const url = URL.createObjectURL(file);
      setGameImagePreview(url);
    }
  };

  const handleAnswerImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAnswerImageFile(file);
      const url = URL.createObjectURL(file);
      setAnswerImagePreview(url);
    }
  };

  const handleUpdate = async () => {
    if (!image || acceptedAnswers.length === 0) return;

    setLoading(true);
    try {
      let gameImagePath = image.storage_path;
      let answerImagePath = image.original_storage_path;
      const timestamp = Date.now();

      // Upload new game image if selected
      if (newGameImageFile) {
        const newGameImageFileName = `game_${timestamp}_${newGameImageFile.name}`;
        const { error: gameUploadError } = await supabase.storage
          .from('masked-rider-images')
          .upload(newGameImageFileName, newGameImageFile);

        if (gameUploadError) throw gameUploadError;

        // Delete old game image
        if (image.storage_path) {
          await supabase.storage
            .from('masked-rider-images')
            .remove([image.storage_path]);
        }

        gameImagePath = newGameImageFileName;
      }

      // Upload new answer image if selected
      if (newAnswerImageFile) {
        const newAnswerImageFileName = `answer_${timestamp}_${newAnswerImageFile.name}`;
        const { error: answerUploadError } = await supabase.storage
          .from('masked-rider-images')
          .upload(newAnswerImageFileName, newAnswerImageFile);

        if (answerUploadError) throw answerUploadError;

        // Delete old answer image
        if (image.original_storage_path) {
          await supabase.storage
            .from('masked-rider-images')
            .remove([image.original_storage_path]);
        }

        answerImagePath = newAnswerImageFileName;
      }

      // Update database
      const { error } = await supabase
        .from('masked_rider_images')
        .update({
          answer: acceptedAnswers[0],
          accepted_answers: acceptedAnswers,
          category: selectedCategory,
          storage_path: gameImagePath,
          original_storage_path: answerImagePath,
          filename: newGameImageFile ? newGameImageFile.name : image.filename
        })
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: "แก้ไขรูปภาพสำเร็จ",
        description: "ข้อมูลรูปภาพได้รับการอัพเดตแล้ว",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขรูปภาพได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">แก้ไขรูปภาพ</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Label className="text-black">รูปเล่นเกมใหม่ (1:1)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleGameImageSelect}
                  className="cursor-pointer bg-white border-gray-300 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">เว้นว่างไว้หากต้องการใช้รูปเดิม</p>
              </div>

              <div>
                <Label className="text-black">รูปเฉลยใหม่ (รูปเต็ม)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAnswerImageSelect}
                  className="cursor-pointer bg-white border-gray-300 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">เว้นว่างไว้หากต้องการใช้รูปเดิม</p>
              </div>

              <MultiAnswerInput
                answers={acceptedAnswers}
                onChange={setAcceptedAnswers}
                label="คำตอบที่ยอมรับได้ (ไทย/อังกฤษ)"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-black">รูปเล่นเกมปัจจุบัน</Label>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={gameImagePreview || image.imageUrl}
                    alt="Current game image"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>

              <div>
                <Label className="text-black">รูปเฉลยปัจจุบัน</Label>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={answerImagePreview || image.originalImageUrl || image.imageUrl}
                    alt="Current answer image"
                    className="w-full h-48 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} className="border-gray-400 text-gray-600">
              ยกเลิก
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading || acceptedAnswers.length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditImageModal;
