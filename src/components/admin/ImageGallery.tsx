
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
      // Delete game image from storage
      await supabase.storage
        .from('masked-rider-images')
        .remove([image.storage_path]);

      // Delete answer image from storage
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
      <Card className="luxury-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gold" />
              <span className="text-gold">
                {categories.find(c => c.name === selectedCategoryView)?.display_name}
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {images.length} รูปภาพ
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gold">กำลังโหลด...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีรูปภาพในหมวดหมู่นี้
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="bg-rich-black-lighter border-gold/20 hover:border-gold/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <CardContent className="p-4">
                    <div className="space-y-3 mb-3">
                      {/* Game Image */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1">รูปเล่นเกม</p>
                        <div className="aspect-square overflow-hidden rounded-lg bg-black/50 border border-white/5">
                          <img
                            src={image.imageUrl}
                            alt={`${image.answer} - เล่นเกม`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.co/400x400?text=Error+Loading";
                              e.currentTarget.className = "w-full h-full object-cover opacity-50";
                            }}
                          />
                        </div>
                      </div>

                      {/* Answer Image */}
                      {image.originalImageUrl && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">รูปเฉลย</p>
                          <div className="aspect-square overflow-hidden rounded-lg bg-black/50 border border-white/5">
                            <img
                              src={image.originalImageUrl}
                              alt={`${image.answer} - เฉลย`}
                              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/400x400?text=Error+Loading";
                                e.currentTarget.className = "w-full h-full object-contain opacity-50";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-gold text-lg">{image.answer}</p>
                      <div className="flex flex-wrap gap-1">
                        {image.accepted_answers.map((answer, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-gold/10 text-gold border border-gold/20">
                            {answer}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 font-mono text-ellipsis overflow-hidden whitespace-nowrap">
                        ไฟล์: {image.storage_path}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(image)}
                          className="flex-1 border-gold/50 text-gold hover:bg-gold hover:text-rich-black"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImage(image)}
                          className="flex-1 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800/50"
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
