import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, Image as ImageIcon, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EditCategoryModal from './EditCategoryModal';

interface GameCategory {
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  cover_image_path: string | null;
  coverImageUrl?: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    display_name: '',
    description: '',
    icon: '🎮'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<GameCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .order('created_at');

      if (error) throw error;

      const categoriesWithImages = await Promise.all(
        (data || []).map(async (category) => {
          let coverImageUrl = '';
          if (category.cover_image_path) {
            const { data: urlData } = supabase.storage
              .from('category-covers')
              .getPublicUrl(category.cover_image_path);
            coverImageUrl = urlData.publicUrl;
          }

          return {
            ...category,
            coverImageUrl
          };
        })
      );

      setCategories(categoriesWithImages);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดหมวดหมู่ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const createCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.display_name.trim()) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "ต้องมีชื่อหมวดหมู่และชื่อที่แสดง",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let coverImagePath = null;

      if (selectedFile) {
        const timestamp = Date.now();
        const fileName = `cover_${timestamp}_${selectedFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('category-covers')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        coverImagePath = fileName;
      }

      const { error: dbError } = await supabase
        .from('game_categories')
        .insert({
          name: newCategory.name.trim(),
          display_name: newCategory.display_name.trim(),
          description: newCategory.description.trim() || null,
          icon: newCategory.icon,
          cover_image_path: coverImagePath
        });

      if (dbError) throw dbError;

      toast({
        title: "เพิ่มหมวดหมู่สำเร็จ",
        description: `เพิ่มหมวดหมู่ "${newCategory.display_name}" แล้ว`,
      });

      setNewCategory({
        name: '',
        display_name: '',
        description: '',
        icon: '🎮'
      });
      setSelectedFile(null);
      setPreviewUrl('');
      loadCategories();

    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มหมวดหมู่ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (category: GameCategory) => {
    if (!confirm(`ต้องการลบหมวดหมู่ "${category.display_name}" หรือไม่?`)) return;

    try {
      if (category.cover_image_path) {
        await supabase.storage
          .from('category-covers')
          .remove([category.cover_image_path]);
      }

      const { error } = await supabase
        .from('game_categories')
        .delete()
        .eq('name', category.name);

      if (error) throw error;

      toast({
        title: "ลบหมวดหมู่สำเร็จ",
        description: `ลบหมวดหมู่ "${category.display_name}" แล้ว`,
      });

      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบหมวดหมู่ได้",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (category: GameCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Add New Category Form */}
      <Card className="luxury-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold">
            <Plus className="w-5 h-5" />
            เพิ่มหมวดหมู่ใหม่
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">ชื่อหมวดหมู่ (ภาษาอังกฤษ)</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="เช่น masked_rider"
                  className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50 placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label className="text-gray-300">ชื่อที่แสดง</Label>
                <Input
                  value={newCategory.display_name}
                  onChange={(e) => setNewCategory({ ...newCategory, display_name: e.target.value })}
                  placeholder="เช่น มาสค์ไรเดอร์"
                  className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50 placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label className="text-gray-300">คำอธิบาย</Label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="คำอธิบายหมวดหมู่..."
                  className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50 placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label className="text-gray-300">ไอคอน</Label>
                <Input
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  placeholder="🎮"
                  className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50 placeholder:text-gray-500"
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
                onClick={createCategory}
                disabled={loading}
                className="w-full luxury-button mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "กำลังเพิ่ม..." : "เพิ่มหมวดหมู่"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Categories */}
      <Card className="luxury-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold">
              <ImageIcon className="w-5 h-5" />
              หมวดหมู่ที่มีอยู่
            </div>
            <span className="text-sm text-gray-400">
              {categories.length} หมวดหมู่
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีหมวดหมู่
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.name} className="bg-rich-black-lighter border-gold/20 hover:border-gold/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <CardContent className="p-4">
                    <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-black/50 flex items-center justify-center border border-white/5">
                      {category.coverImageUrl ? (
                        <img
                          src={category.coverImageUrl}
                          alt={category.display_name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-4xl">{category.icon}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-gold text-lg">{category.display_name}</h3>
                      <p className="text-xs text-gray-500 font-mono">ID: {category.name}</p>
                      {category.description && (
                        <p className="text-sm text-gray-400 line-clamp-2">{category.description}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openEditModal(category)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCategory(category)}
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

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={loadCategories}
        />
      )}
    </div>
  );
};

export default CategoryManager;
