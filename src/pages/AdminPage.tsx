
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUploadForm from "@/components/admin/ImageUploadForm";
import CategorySelector from "@/components/admin/CategorySelector";
import ImageGallery from "@/components/admin/ImageGallery";
import CategoryManager from "@/components/CategoryManager";

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

const AdminPage = () => {
  return (
    <AdminAuthWrapper>
      <AdminPageContent />
    </AdminAuthWrapper>
  );
};

const AdminPageContent = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryView, setSelectedCategoryView] = useState<string>("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryView) {
      loadImagesByCategory(selectedCategoryView);
    }
  }, [selectedCategoryView]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setCategories(data || []);

      // Set default category if categories exist
      if (data && data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].name);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadImagesByCategory = async (categoryName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('masked_rider_images')
        .select('*')
        .eq('category', categoryName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const imagesWithUrls = await Promise.all(
        (data || []).map(async (img) => {
          const { data: urlData } = supabase.storage
            .from('masked-rider-images')
            .getPublicUrl(img.storage_path);

          let originalImageUrl = urlData.publicUrl;
          if (img.original_storage_path) {
            const { data: originalUrlData } = supabase.storage
              .from('masked-rider-images')
              .getPublicUrl(img.original_storage_path);
            originalImageUrl = originalUrlData.publicUrl;
          }

          // Properly parse accepted_answers and ensure it's string[]
          let acceptedAnswersList: string[] = [img.answer];
          if (img.accepted_answers && Array.isArray(img.accepted_answers)) {
            acceptedAnswersList = img.accepted_answers.filter((answer: any): answer is string =>
              typeof answer === 'string'
            );
          }

          return {
            ...img,
            imageUrl: urlData.publicUrl,
            originalImageUrl: originalImageUrl,
            accepted_answers: acceptedAnswersList
          } as ImageItem;
        })
      );

      setImages(imagesWithUrls);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = () => {
    if (selectedCategoryView === selectedCategory) {
      loadImagesByCategory(selectedCategory);
    }
  };

  const handleImageDeleted = () => {
    loadImagesByCategory(selectedCategoryView);
  };

  return (
    <div className="min-h-screen bg-rich-black text-foreground">
      <div className="max-w-6xl mx-auto p-4">
        <AdminHeader />

        {/* Tabs for different management sections */}
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-rich-black-lighter border border-gold/20 p-1 rounded-xl">
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-luxury-red data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(255,0,0,0.3)] text-gray-400 hover:text-white transition-all duration-300 rounded-lg py-3 font-heading tracking-wide"
            >
              <Folder className="w-4 h-4 mr-2" />
              จัดการหมวดหมู่
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="data-[state=active]:bg-luxury-red data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(255,0,0,0.3)] text-gray-400 hover:text-white transition-all duration-300 rounded-lg py-3 font-heading tracking-wide"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              จัดการรูปภาพ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <ImageUploadForm
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onImageUploaded={handleImageUploaded}
            />

            <CategorySelector
              categories={categories}
              selectedCategoryView={selectedCategoryView}
              setSelectedCategoryView={setSelectedCategoryView}
            />

            <ImageGallery
              images={images}
              categories={categories}
              selectedCategoryView={selectedCategoryView}
              loading={loading}
              onImageDeleted={handleImageDeleted}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
