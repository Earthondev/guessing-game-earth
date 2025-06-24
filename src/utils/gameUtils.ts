
import { supabase } from "@/integrations/supabase/client";
import { ImageData } from "@/types/game";

export const getCategoryDisplayName = async (category: string): Promise<string> => {
  try {
    const { data } = await supabase
      .from('game_categories')
      .select('display_name')
      .eq('name', category)
      .maybeSingle();
    
    return data?.display_name || 'ไม่ทราบหมวดหมู่';
  } catch {
    return 'ไม่ทราบหมวดหมู่';
  }
};

export const loadImagesFromSupabase = async (category: string): Promise<ImageData[]> => {
  // First, get category information
  const { data: categoryData } = await supabase
    .from('game_categories')
    .select('*')
    .eq('name', category)
    .maybeSingle();

  if (!categoryData) {
    throw new Error(`Category ${category} not found`);
  }

  // Then get images for this category
  const { data: imagesData, error } = await supabase
    .from('masked_rider_images')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error('Error loading images:', error);
    throw error;
  }

  if (!imagesData || imagesData.length === 0) {
    throw new Error('No images found for category');
  }

  // Process images and get public URLs
  const imagesWithUrls = await Promise.all(
    imagesData.map(async (img) => {
      try {
        // Get cropped image URL
        const { data: croppedUrlData } = supabase.storage
          .from('masked-rider-images')
          .getPublicUrl(img.storage_path);
        
        let originalImageUrl = croppedUrlData.publicUrl;
        
        // Get original image URL if exists
        if (img.original_storage_path) {
          const { data: originalUrlData } = supabase.storage
            .from('masked-rider-images')
            .getPublicUrl(img.original_storage_path);
          originalImageUrl = originalUrlData.publicUrl;
        }
        
        return {
          id: img.id,
          imageUrl: croppedUrlData.publicUrl,
          originalImageUrl: originalImageUrl,
          answer: img.answer
        };
      } catch (error) {
        console.error('Error processing image:', img.filename, error);
        return null;
      }
    })
  );

  // Filter out any failed image processing
  const validImages = imagesWithUrls.filter((img): img is ImageData => {
    return img !== null && 
           typeof img.id === 'string' && 
           typeof img.imageUrl === 'string' && 
           typeof img.answer === 'string';
  });

  if (validImages.length === 0) {
    throw new Error('No valid images could be processed');
  }

  return validImages;
};

export const selectGameImages = (imageList: ImageData[], count: number = 5): ImageData[] => {
  if (imageList.length === 0) return [];
  
  const shuffled = [...imageList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, imageList.length));
};
