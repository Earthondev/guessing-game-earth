
import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ImageCropper from "@/components/ImageCropper";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [acceptedAnswers, setAcceptedAnswers] = useState<string[]>([]);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (originalFile: File, croppedFile: File) => {
    const croppedUrl = URL.createObjectURL(croppedFile);
    setCroppedImage(croppedUrl);
    setShowCropper(false);
  };

  const uploadImage = async () => {
    if (!selectedFile || !croppedImage || acceptedAnswers.length === 0) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "เลือกรูปภาพ, ครอปรูป และใส่คำตอบอย่างน้อย 1 คำ",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const timestamp = Date.now();
      const originalFileName = `original_${timestamp}_${selectedFile.name}`;
      const croppedFileName = `cropped_${timestamp}_${selectedFile.name}`;

      // Upload original image
      const { error: originalUploadError } = await supabase.storage
        .from('masked-rider-images')
        .upload(originalFileName, selectedFile);

      if (originalUploadError) throw originalUploadError;

      // Convert cropped image data to blob and upload
      const response = await fetch(croppedImage);
      const croppedBlob = await response.blob();

      const { error: croppedUploadError } = await supabase.storage
        .from('masked-rider-images')
        .upload(croppedFileName, croppedBlob);

      if (croppedUploadError) throw croppedUploadError;

      // Save metadata to database with accepted answers
      const { error: dbError } = await supabase
        .from('masked_rider_images')
        .insert({
          filename: selectedFile.name,
          storage_path: croppedFileName,
          original_storage_path: originalFileName,
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
      setSelectedFile(null);
      setPreviewUrl("");
      setCroppedImage("");
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
    <>
      <Card className="bg-white border-gray-300 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Plus className="w-5 h-5" />
            เพิ่มรูปภาพใหม่
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label className="text-black">เลือกรูปภาพ</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer bg-white border-gray-300 text-black"
                />
              </div>

              <MultiAnswerInput
                answers={acceptedAnswers}
                onChange={setAcceptedAnswers}
                label="คำตอบที่ยอมรับได้ (ไทย/อังกฤษ)"
              />

              <Button
                onClick={uploadImage}
                disabled={loading || !selectedFile || !croppedImage || acceptedAnswers.length === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "กำลังบันทึก..." : "บันทึกรูปภาพ"}
              </Button>
            </div>

            <div className="space-y-4">
              {croppedImage && (
                <div>
                  <Label className="text-black">ตัวอย่างรูปที่ครอป (1:1)</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="w-48 h-48 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={croppedImage}
                        alt="Cropped preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Cropper Modal */}
      {showCropper && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-black">ครอปรูปภาพเป็นสี่เหลี่ยมจัตุรัส (1:1)</h3>
              <ImageCropper
                imageUrl={previewUrl}
                onCropComplete={handleCropComplete}
                onCancel={() => {
                  setShowCropper(false);
                  setSelectedFile(null);
                  setPreviewUrl("");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploadForm;
