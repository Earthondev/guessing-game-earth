import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Save, Image as ImageIcon, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageCropper from "@/components/ImageCropper";

interface ImageData {
  id: string;
  filename: string;
  storage_path: string;
  original_storage_path?: string;
  answer: string;
  imageUrl: string;
  originalImageUrl?: string;
  created_at: string;
}

interface NewImageData {
  id: string;
  imageUrl: string;
  originalImageUrl: string;
  answer: string;
  file: File;
  originalFile: File;
  cropData?: any;
}

const AdminPage = () => {
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  const [newImages, setNewImages] = useState<NewImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [cropperImage, setCropperImage] = useState<File | null>(null);
  const { toast } = useToast();

  // Load existing images from Supabase
  const loadExistingImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('masked_rider_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get public URLs for each image
      const imagesWithUrls = await Promise.all(
        data.map(async (img) => {
          const { data: urlData } = supabase.storage
            .from('masked-rider-images')
            .getPublicUrl(img.storage_path);
          
          return {
            ...img,
            imageUrl: urlData.publicUrl
          };
        })
      );

      setExistingImages(imagesWithUrls);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดรูปภาพได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExistingImages();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (files.length > 1) {
      // Handle multiple files - show cropper for first file
      setCropperImage(files[0]);
      toast({
        title: "กำลังครอปรูปภาพ",
        description: "กรุณาเลือกพื้นที่ที่ต้องการสำหรับเกม",
      });
    } else if (files.length === 1) {
      // Single file - show cropper
      setCropperImage(files[0]);
    }

    // Reset input
    event.target.value = '';
  };

  const handleCropComplete = (originalFile: File, croppedFile: File, cropData: any) => {
    if (newImages.length >= 10) {
      toast({
        title: "เกินขีดจำกัด",
        description: "สามารถอัปโหลดได้สูงสุด 10 รูปภาพเท่านั้น",
        variant: "destructive",
      });
      setCropperImage(null);
      return;
    }

    const croppedImageUrl = URL.createObjectURL(croppedFile);
    const originalImageUrl = URL.createObjectURL(originalFile);
    
    const newImage: NewImageData = {
      id: `new_img_${Date.now()}`,
      imageUrl: croppedImageUrl,
      originalImageUrl: originalImageUrl,
      answer: "",
      file: croppedFile,
      originalFile: originalFile,
      cropData: cropData,
    };
    
    setNewImages(prev => [...prev, newImage]);
    setCropperImage(null);
    
    toast({
      title: "เพิ่มรูปภาพแล้ว",
      description: "รูปภาพถูกครอปและเพิ่มเรียบร้อยแล้ว",
    });
  };

  const handleCropCancel = () => {
    setCropperImage(null);
  };

  const updateNewImageAnswer = (id: string, answer: string) => {
    setNewImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, answer } : img
      )
    );
  };

  const updateExistingImageAnswer = async (id: string, answer: string) => {
    try {
      const { error } = await supabase
        .from('masked_rider_images')
        .update({ answer, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setExistingImages(prev =>
        prev.map(img =>
          img.id === id ? { ...img, answer } : img
        )
      );

      toast({
        title: "อัปเดตแล้ว",
        description: "บันทึกคำเฉลยแล้ว",
      });
    } catch (error) {
      console.error('Error updating answer:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกคำเฉลยได้",
        variant: "destructive",
      });
    }
  };

  const deleteNewImage = (id: string) => {
    setNewImages(prev => {
      const imageToDelete = prev.find(img => img.id === id);
      if (imageToDelete?.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageToDelete.imageUrl);
      }
      return prev.filter(img => img.id !== id);
    });
    
    toast({
      title: "ลบแล้ว",
      description: "ลบรูปภาพใหม่แล้ว",
    });
  };

  const deleteExistingImage = async (image: ImageData) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('masked-rider-images')
        .remove([image.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('masked_rider_images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      setExistingImages(prev => prev.filter(img => img.id !== image.id));
      
      toast({
        title: "ลบสำเร็จ",
        description: "ลบรูปภาพแล้ว",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบรูปภาพได้",
        variant: "destructive",
      });
    }
  };

  const saveNewImages = async () => {
    const validImages = newImages.filter(img => img.answer.trim() !== "");
    
    if (validImages.length === 0) {
      toast({
        title: "ไม่มีข้อมูล",
        description: "กรุณาเพิ่มรูปภาพและใส่คำเฉลยก่อน",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      for (const image of validImages) {
        // Upload original file
        const originalFileExt = image.originalFile.name.split('.').pop();
        const originalFileName = `original_${Date.now()}_${Math.random().toString(36).substring(2)}.${originalFileExt}`;
        
        const { error: originalUploadError } = await supabase.storage
          .from('masked-rider-images')
          .upload(originalFileName, image.originalFile);

        if (originalUploadError) throw originalUploadError;

        // Upload cropped file
        const croppedFileExt = image.file.name.split('.').pop();
        const croppedFileName = `cropped_${Date.now()}_${Math.random().toString(36).substring(2)}.${croppedFileExt}`;
        
        const { error: croppedUploadError } = await supabase.storage
          .from('masked-rider-images')
          .upload(croppedFileName, image.file);

        if (croppedUploadError) throw croppedUploadError;

        // Save metadata to database with both paths
        const { error: dbError } = await supabase
          .from('masked_rider_images')
          .insert({
            filename: image.originalFile.name,
            storage_path: croppedFileName,
            original_storage_path: originalFileName,
            answer: image.answer
          });

        if (dbError) throw dbError;

        // Cleanup blob URLs
        URL.revokeObjectURL(image.imageUrl);
        URL.revokeObjectURL(image.originalImageUrl);
      }

      setNewImages([]);
      await loadExistingImages(); // Reload to show new images
      
      toast({
        title: "บันทึกสำเร็จ",
        description: `บันทึกรูปภาพ ${validImages.length} รูป พร้อมรูปต้นฉบับ`,
      });
    } catch (error) {
      console.error('Error saving images:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกรูปภาพได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImages.length + newImages.length;

  if (cropperImage) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-orbitron font-bold text-rider-gold mb-2">
              ครอปรูปภาพ
            </h1>
            <p className="text-muted-foreground">
              เลือกพื้นที่ที่ต้องการใช้ในเกมเพื่อเพิ่มความยาก
            </p>
          </div>
          
          <ImageCropper
            imageFile={cropperImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with enhanced animations */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="hover:scale-105 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="animate-fade-in">
              <h1 className="text-3xl font-orbitron font-bold text-rider-gold flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                จัดการรูปภาพ
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                ระบบครอปขั้นสูงเพื่อเพิ่มความท้าทาย
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={loadExistingImages}
              variant="outline"
              size="sm"
              disabled={loading}
              className="hover:scale-105 transition-transform"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <div className="text-sm text-muted-foreground animate-pulse">
              รูปภาพทั้งหมด <span className="text-rider-gold font-bold">{totalImages}</span> รูป
            </div>
          </div>
        </div>

        {/* Enhanced Upload Section */}
        <Card className="admin-card mb-8 border-2 border-rider-gold bg-gradient-to-br from-black to-rider-black-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rider-gold">
              <Upload className="w-5 h-5" />
              อัปโหลดรูปภาพใหม่
              <span className="ml-auto text-xs bg-rider-gold text-black px-2 py-1 rounded-full">
                NEW CROPPING SYSTEM
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload" className="text-rider-gold">เลือกรูปภาพมาสค์ไรเดอร์</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={newImages.length >= 10 || loading}
                  className="mt-2 border-rider-metal focus:border-rider-gold"
                />
              </div>
              <div className="bg-rider-black-light p-4 rounded-lg border border-rider-metal">
                <p className="text-sm text-rider-gold font-semibold mb-2">🎯 ระบบครอปขั้นสูง:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• รองรับไฟล์ JPG, PNG, GIF (สูงสุด 10 รูป)</li>
                  <li>• ระบบจะแสดงหน้าต่างครอปให้เลือกพื้นที่</li>
                  <li>• เก็บทั้งรูปต้นฉบับและรูปที่ครอปแล้ว</li>
                  <li>• เฉลยจะแสดงรูปต้นฉบับเต็มๆ</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-rider-gold">รูปภาพที่มีอยู่ ({existingImages.length} รูป)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingImages.map((image) => (
                <Card key={image.id} className="admin-card">
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image.imageUrl}
                        alt={image.filename}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => deleteExistingImage(image)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>ชื่อไฟล์: {image.filename}</Label>
                      <Input
                        placeholder="คำเฉลย/ชื่อมาสค์ไรเดอร์"
                        value={image.answer}
                        onChange={(e) => updateExistingImageAnswer(image.id, e.target.value)}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        อัปโหลดเมื่อ: {new Date(image.created_at).toLocaleString('th-TH')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* New Images Grid */}
        {newImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-rider-red">รูปภาพใหม่ ({newImages.length} รูป)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newImages.map((image) => (
                <Card key={image.id} className="admin-card border-rider-red">
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image.imageUrl}
                        alt="New upload"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => deleteNewImage(image.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`answer-${image.id}`}>คำเฉลย/ชื่อมาสค์ไรเดอร์</Label>
                      <Input
                        id={`answer-${image.id}`}
                        placeholder="เช่น Kamen Rider Zero-One"
                        value={image.answer}
                        onChange={(e) => updateNewImageAnswer(image.id, e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {existingImages.length === 0 && newImages.length === 0 && !loading && (
          <Card className="admin-card">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">ยังไม่มีรูปภาพ</h3>
              <p className="text-muted-foreground">
                อัปโหลดรูปภาพมาสค์ไรเดอร์เพื่อเริ่มสร้างเกม
              </p>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Save Button */}
        {newImages.length > 0 && (
          <div className="text-center mb-8">
            <Button 
              onClick={saveNewImages} 
              className="hero-button hover:scale-105 transition-all duration-300 relative overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rider-gold via-rider-gold-light to-rider-gold opacity-20 animate-shine"></div>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "กำลังบันทึก..." : `บันทึกรูปภาพใหม่ ${newImages.length} รูป`}
            </Button>
          </div>
        )}

        {/* Enhanced Info Card */}
        <Card className="admin-card border-rider-gold bg-gradient-to-br from-rider-black to-rider-black-light">
          <CardContent className="p-6">
            <h3 className="font-bold text-rider-gold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              📋 ระบบครอปขั้นสูง - คุณสมบัติใหม่
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <span className="text-rider-gold">ครอปอัตโนมัติ:</span> เลือกพื้นที่ที่ต้องการก่อนบันทึก</p>
              <p>• <span className="text-rider-gold">เก็บรูปต้นฉบับ:</span> ระบบเก็บทั้งรูปครอปและรูปเต็ม</p>
              <p>• <span className="text-rider-gold">เฉลยแบบเต็ม:</span> แสดงรูปต้นฉบับเมื่อเฉลย</p>
              <p>• <span className="text-rider-gold">เพิ่มความยาก:</span> ครอปเฉพาะส่วนสำคัญ</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
