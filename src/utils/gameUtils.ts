
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
  // First, get category information by name
  const { data: categoryData } = await supabase
    .from('game_categories')
    .select('*')
    .eq('name', category)
    .maybeSingle();

  if (!categoryData) {
    throw new Error(`Category ${category} not found`);
  }

  // Then get images for this category using category name
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
        let croppedUrl = img.storage_path;
        if (!img.storage_path.startsWith('http')) {
          const { data } = supabase.storage
            .from('masked-rider-images')
            .getPublicUrl(img.storage_path);
          croppedUrl = data.publicUrl;
        }

        let originalImageUrl = croppedUrl;

        // Get original image URL if exists
        if (img.original_storage_path) {
          if (img.original_storage_path.startsWith('http')) {
            originalImageUrl = img.original_storage_path;
          } else {
            const { data } = supabase.storage
              .from('masked-rider-images')
              .getPublicUrl(img.original_storage_path);
            originalImageUrl = data.publicUrl;
          }
        }

        // Parse accepted_answers from JSON, fallback to single answer
        let acceptedAnswers: string[] = [img.answer];
        if (img.accepted_answers && Array.isArray(img.accepted_answers)) {
          // Properly filter and type cast to ensure only strings
          acceptedAnswers = img.accepted_answers.filter((answer: any): answer is string =>
            typeof answer === 'string'
          );
        }

        return {
          id: img.id,
          imageUrl: croppedUrl,
          originalImageUrl: originalImageUrl,
          answer: img.answer,
          acceptedAnswers: acceptedAnswers
        };
      } catch (error) {
        console.error('Error processing image:', img.storage_path, error);
        return null;
      }
    })
  );

  // Filter out any failed image processing
  const validImages = imagesWithUrls.filter((img: any): img is ImageData => {
    return img !== null &&
      typeof img.id === 'string' &&
      typeof img.imageUrl === 'string' &&
      typeof img.answer === 'string' &&
      (img.originalImageUrl === undefined || typeof img.originalImageUrl === 'string') &&
      Array.isArray(img.acceptedAnswers);
  });

  if (validImages.length === 0) {
    throw new Error('No valid images could be processed');
  }

  return validImages;
};

// Enhanced random selection with better distribution
export const selectGameImages = (imageList: ImageData[], count: number = 10): ImageData[] => {
  if (imageList.length === 0) return [];

  // If we have fewer images than requested, return all shuffled
  if (imageList.length <= count) {
    return [...imageList].sort(() => Math.random() - 0.5);
  }

  // Better shuffling algorithm (Fisher-Yates)
  const shuffled = [...imageList];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};
