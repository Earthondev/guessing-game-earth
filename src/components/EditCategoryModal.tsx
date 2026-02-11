
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GameCategory {
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  cover_image_path: string | null;
  coverImageUrl?: string;
}

interface EditCategoryModalProps {
  category: GameCategory;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCategoryModal = ({ category, isOpen, onClose, onUpdate }: EditCategoryModalProps) => {
  const [editData, setEditData] = useState({
    display_name: '',
    description: '',
    icon: '🎮'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setEditData({
        display_name: category.display_name,
        description: category.description || '',
        icon: category.icon || '🎮'
      });
      setPreviewUrl(category.coverImageUrl || '');
    }
  }, [category]);

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
    }
  };

  const sanitizeFileName = (fileName: string): string => {
    // Remove special characters and spaces, replace with underscores or hyphens
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const updateCategory = async () => {
    if (!editData.display_name.trim()) {
      toast({
        title: "กรุณากรอกชื่อที่แสดง",
        description: "ชื่อที่แสดงเป็นข้อมูลที่จำเป็น",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let coverImagePath = category.cover_image_path;

      // Upload new cover image if selected
      if (selectedFile) {
        // Delete old image if exists
        if (category.cover_image_path) {
          await supabase.storage
            .from('category-covers')
            .remove([category.cover_image_path]);
        }

        const timestamp = Date.now();
        const sanitizedFileName = sanitizeFileName(selectedFile.name);
        const fileName = `cover_${timestamp}_${sanitizedFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('category-covers')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        coverImagePath = fileName;
      }

      // Update category
      const { error: dbError } = await supabase
        .from('game_categories')
        .update({
          display_name: editData.display_name.trim(),
          description: editData.description.trim() || null,
          icon: editData.icon,
          cover_image_path: coverImagePath
        })
        .eq('name', category.name);

      if (dbError) throw dbError;

      toast({
        title: "อัปเดตหมวดหมู่สำเร็จ",
        description: `อัปเดตหมวดหมู่ "${editData.display_name}" แล้ว`,
      });

      onUpdate();
      onClose();

    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตหมวดหมู่ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="luxury-card border-gold/20 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="border-b border-gold/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold">แก้ไขหมวดหมู่</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">ชื่อที่แสดง</Label>
                <Input
                  value={editData.display_name}
                  onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                  placeholder="เช่น มาสค์ไรเดอร์"
                  className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50"
                />
              </div>

              <div>
                <Label className="text-gray-300">คำอธิบาย</Label>
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="คำอธิบายหมวดหมู่..."
                  className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50"
                />
              </div>

              <div>
                <Label className="text-gray-300">ไอคอน</Label>
                <Input
                  value={editData.icon}
                  onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                  placeholder="🎮"
                  className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">รูปปกหมวดหมู่</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer bg-rich-black-lighter border-gold/20 text-white file:bg-luxury-red file:border-0 file:text-white file:mr-4 file:px-4 file:py-2 file:rounded-full file:text-sm file:font-semibold hover:file:bg-luxury-red-vivid transition-colors"
                  style={{ height: 'auto', padding: '0.5rem' }}
                />
              </div>

              {previewUrl && (
                <div>
                  <Label className="text-gray-300">ตัวอย่างรูปปก</Label>
                  <div className="border border-gold/20 rounded-lg p-4 bg-rich-black-lighter">
                    <img
                      src={previewUrl}
                      alt="Cover preview"
                      className="w-full max-w-xs mx-auto rounded-lg border border-white/10"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={updateCategory}
                disabled={loading}
                className="w-full luxury-button mt-4"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "กำลังอัปเดต..." : "อัปเดตหมวดหมู่"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategoryModal;
