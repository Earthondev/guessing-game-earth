
import { Eye, Trash2, Image as ImageIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import EditImageModal from "./EditImageModal";

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

interface ImageGalleryProps {
  images: ImageItem[];
  categories: any[];
  selectedCategoryView: string;
  loading: boolean;
  onImageDeleted: () => void;
}

const ImageGallery = ({ images, categories, selectedCategoryView, loading, onImageDeleted }: ImageGalleryProps) => {
  const { toast } = useToast();
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteImage = async (image: ImageItem) => {
    if (!confirm(`ต้องการลบรูปภาพ "${image.answer}" หรือไม่?`)) return;

    try {
      // Delete from storage
      await supabase.storage
        .from('masked-rider-images')
        .remove([image.storage_path]);

      if (image.original_storage_path) {
        await supabase.storage
          .from('masked-rider-images')
          .remove([image.original_storage_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('masked_rider_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: "ลบรูปภาพสำเร็จ",
        description: `ลบรูปภาพ "${image.answer}" แล้ว`,
      });

      onImageDeleted();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบรูปภาพได้",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (image: ImageItem) => {
    setEditingImage(image);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingImage(null);
  };

  const handleImageUpdated = () => {
    onImageDeleted(); // Reuse the same callback to refresh images
    handleEditModalClose();
  };

  if (!selectedCategoryView) return null;

  return (
    <>
      <Card className="bg-white border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-black" />
              <span className="text-black">
                {categories.find(c => c.name === selectedCategoryView)?.display_name}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {images.length} รูปภาพ
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-black">กำลังโหลด...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีรูปภาพในหมวดหมู่นี้
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="bg-gray-50 border-gray-300 hover:border-blue-400 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={image.imageUrl}
                        alt={image.answer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-black">{image.answer}</p>
                      <div className="flex flex-wrap gap-1">
                        {image.accepted_answers.map((answer, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {answer}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        ไฟล์: {image.filename}
                      </p>
                      <div className="flex gap-2">
                        {image.originalImageUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(image.originalImageUrl, '_blank')}
                            className="flex-1 border-gray-400 text-gray-600 hover:bg-gray-100"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            รูปต้นฉบับ
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(image)}
                          className="flex-1 border-blue-400 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImage(image)}
                          className="flex-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          ลบ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditImageModal
        image={editingImage}
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onUpdate={handleImageUpdated}
        categories={categories}
      />
    </>
  );
};

export default ImageGallery;
