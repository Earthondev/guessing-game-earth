import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GameCategory {
  id: string;
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
        data.map(async (category) => {
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

      // Upload cover image if selected
      if (selectedFile) {
        const timestamp = Date.now();
        const fileName = `cover_${timestamp}_${selectedFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('category-covers')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        coverImagePath = fileName;
      }

      // Create category
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

      // Reset form
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
      // Delete cover image if exists
      if (category.cover_image_path) {
        await supabase.storage
          .from('category-covers')
          .remove([category.cover_image_path]);
      }

      // Delete category
      const { error } = await supabase
        .from('game_categories')
        .delete()
        .eq('id', category.id);

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

  return (
    <div className="space-y-8">
      {/* Add New Category Form */}
      <Card className="bg-slate-800/50 border-green-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Plus className="w-5 h-5" />
            เพิ่มหมวดหมู่ใหม่
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-slate-200">ชื่อหมวดหมู่ (ภาษาอังกฤษ)</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="เช่น masked_rider"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-200">ชื่อที่แสดง</Label>
                <Input
                  value={newCategory.display_name}
                  onChange={(e) => setNewCategory({...newCategory, display_name: e.target.value})}
                  placeholder="เช่น มาสค์ไรเดอร์"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-200">คำอธิบาย</Label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="คำอธิบายหมวดหมู่..."
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-200">ไอคอน</Label>
                <Input
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  placeholder="🎮"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-200">รูปปกหมวดหมู่</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer bg-slate-800 border-slate-600 text-white"
                />
              </div>

              {previewUrl && (
                <div>
                  <Label className="text-slate-200">ตัวอย่างรูปปก</Label>
                  <div className="border rounded-lg p-4 bg-slate-700">
                    <img
                      src={previewUrl}
                      alt="Cover preview"
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={createCategory}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "กำลังเพิ่ม..." : "เพิ่มหมวดหมู่"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Categories */}
      <Card className="bg-slate-800/50 border-green-400/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-400">
              <ImageIcon className="w-5 h-5" />
              หมวดหมู่ที่มีอยู่
            </div>
            <span className="text-sm text-slate-300">
              {categories.length} หมวดหมู่
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              ยังไม่มีหมวดหมู่
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="bg-slate-700 border-slate-600 hover:border-green-400 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-slate-600 flex items-center justify-center">
                      {category.coverImageUrl ? (
                        <img
                          src={category.coverImageUrl}
                          alt={category.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">{category.icon}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-green-400">{category.display_name}</h3>
                      <p className="text-xs text-slate-400">ID: {category.name}</p>
                      {category.description && (
                        <p className="text-sm text-slate-300">{category.description}</p>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCategory(category)}
                        className="w-full"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        ลบหมวดหมู่
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
