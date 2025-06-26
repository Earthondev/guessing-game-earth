
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MultiAnswerInput from '@/components/MultiAnswerInput';
import ImageCropper from '@/components/ImageCropper';

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
  const [editData, setEditData] = useState({
    category: '',
    accepted_answers: [] as string[]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (image) {
      setEditData({
        category: image.category,
        accepted_answers: image.accepted_answers || [image.answer]
      });
      setPreviewUrl("");
      setCroppedImage("");
      setSelectedFile(null);
    }
  }, [image]);

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

  const updateImage = async () => {
    if (!image || editData.accepted_answers.length === 0) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "ใส่คำตอบอย่างน้อย 1 คำ",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let storage_path = image.storage_path;
      let original_storage_path = image.original_storage_path;

      // If new image is selected, upload it
      if (selectedFile && croppedImage) {
        const timestamp = Date.now();
        const originalFileName = `original_${timestamp}_${selectedFile.name}`;
        const croppedFileName = `cropped_${timestamp}_${selectedFile.name}`;

        // Delete old images if they exist
        if (image.storage_path) {
          await supabase.storage
            .from('masked-rider-images')
            .remove([image.storage_path]);
        }
        if (image.original_storage_path) {
          await supabase.storage
            .from('masked-rider-images')
            .remove([image.original_storage_path]);
        }

        // Upload new original image
        const { error: originalUploadError } = await supabase.storage
          .from('masked-rider-images')
          .upload(originalFileName, selectedFile);

        if (originalUploadError) throw originalUploadError;

        // Upload new cropped image
        const response = await fetch(croppedImage);
        const croppedBlob = await response.blob();

        const { error: croppedUploadError } = await supabase.storage
          .from('masked-rider-images')
          .upload(croppedFileName, croppedBlob);

        if (croppedUploadError) throw croppedUploadError;

        storage_path = croppedFileName;
        original_storage_path = originalFileName;
      }

      // Update database record
      const { error: dbError } = await supabase
        .from('masked_rider_images')
        .update({
          answer: editData.accepted_answers[0], // First answer as primary
          accepted_answers: editData.accepted_answers,
          category: editData.category,
          storage_path: storage_path,
          original_storage_path: original_storage_path,
          filename: selectedFile ? selectedFile.name : image.filename
        })
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({
        title: "อัปเดตรูปภาพสำเร็จ",
        description: `อัปเดตรูปภาพ "${editData.accepted_answers[0]}" แล้ว`,
      });

      onUpdate();
      onClose();

    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตรูปภาพได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !image) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <Card className="bg-white border-gray-300 max-w-4xl w-full max-h-[90vh] overflow-auto">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-black">
                <Edit className="w-5 h-5" />
                แก้ไขรูปภาพ
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-600 hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-black">หมวดหมู่</Label>
                  <Select value={editData.category} onValueChange={(value) => setEditData({...editData, category: value})}>
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

                <MultiAnswerInput
                  answers={editData.accepted_answers}
                  onChange={(answers) => setEditData({...editData, accepted_answers: answers})}
                  label="คำตอบที่ยอมรับได้ (ไทย/อังกฤษ)"
                />

                <div>
                  <Label className="text-black">เปลี่ยนรูปภาพ (ไม่บังคับ)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer bg-white border-gray-300 text-black"
                  />
                </div>

                <Button
                  onClick={updateImage}
                  disabled={loading || editData.accepted_answers.length === 0}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-black">รูปภาพปัจจุบัน</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="w-48 h-48 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.answer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {croppedImage && (
                  <div>
                    <Label className="text-black">รูปใหม่ที่ครอป (1:1)</Label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="w-48 h-48 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={croppedImage}
                          alt="New cropped preview"
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
      </div>

      {/* Image Cropper Modal */}
      {showCropper && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-black">ครอปรูปภาพใหม่เป็นสี่เหลี่ยมจัตุรัส (1:1)</h3>
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

export default EditImageModal;
