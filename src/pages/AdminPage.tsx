import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus, Save, Eye, Image as ImageIcon, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ImageCropper from "@/components/ImageCropper";
import CategoryManager from "@/components/CategoryManager";
import { supabase } from "@/integrations/supabase/client";

interface ImageItem {
  id: string;
  filename: string;
  answer: string;
  storage_path: string;
  original_storage_path?: string;
  category: string;
  imageUrl: string;
  originalImageUrl?: string;
}

const AdminPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("masked_rider");
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const { toast } = useToast();

  const categories = [
    { value: "masked_rider", label: "มาสค์ไรเดอร์" },
    { value: "thai_celebrities", label: "ดาราไทย" },
    { value: "thai_movies", label: "หนังไทย" }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadImages();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-green-400/30">
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300">กำลังตรวจสอบสิทธิ์...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('masked_rider_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const imagesWithUrls = await Promise.all(
        data.map(async (img) => {
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

          return {
            ...img,
            imageUrl: urlData.publicUrl,
            originalImageUrl: originalImageUrl
          };
        })
      );

      setImages(imagesWithUrls);
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

  const uploadImage = async () => {
    if (!selectedFile || !croppedImage || !answer.trim()) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "เลือกรูปภาพ, ครอปรูป และใส่คำเฉลย",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const timestamp = Date.now();
      const originalFileName = `original_${timestamp}_${selectedFile.name}`;
      const croppedFileName = `cropped_${timestamp}_${selectedFile.name}`;

      // Upload original image
      const { error: originalUploadError } = await supabase.storage
        .from('masked-rider-images')
        .upload(originalFileName, selectedFile);

      if (originalUploadError) throw originalUploadError;

      // Convert cropped image data to blob and upload
      const response = await fetch(croppedImage);
      const croppedBlob = await response.blob();

      const { error: croppedUploadError } = await supabase.storage
        .from('masked-rider-images')
        .upload(croppedFileName, croppedBlob);

      if (croppedUploadError) throw croppedUploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('masked_rider_images')
        .insert({
          filename: selectedFile.name,
          storage_path: croppedFileName,
          original_storage_path: originalFileName,
          answer: answer.trim(),
          category: selectedCategory
        });

      if (dbError) throw dbError;

      toast({
        title: "เพิ่มรูปภาพสำเร็จ",
        description: `เพิ่มรูปภาพในหมวดหมู่ ${categories.find(c => c.value === selectedCategory)?.label} แล้ว`,
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");
      setCroppedImage("");
      setAnswer("");
      loadImages();

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มรูปภาพได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบรูปภาพได้",
        variant: "destructive",
      });
    }
  };

  const getCategoryImages = (category: string) => {
    return images.filter(img => img.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="hover:scale-105 transition-transform border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-green-400">
                ระบบจัดการเกม
              </h1>
              <p className="text-sm text-slate-300">
                จัดการหมวดหมู่และรูปภาพสำหรับเกม
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for different management sections */}
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-green-400/30">
            <TabsTrigger value="categories" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Folder className="w-4 h-4 mr-2" />
              จัดการหมวดหมู่
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" />
              จัดการรูปภาพ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            {/* Upload Form */}
            <Card className="bg-slate-800/50 border-green-400/30 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Plus className="w-5 h-5" />
                  เพิ่มรูปภาพใหม่
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-200">หมวดหมู่</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-200">เลือกรูปภาพ</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="cursor-pointer bg-slate-800 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-200">คำเฉลย</Label>
                      <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="ใส่คำเฉลย..."
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>

                    <Button
                      onClick={uploadImage}
                      disabled={loading || !selectedFile || !croppedImage || !answer.trim()}
                      className="bg-green-500 hover:bg-green-600 text-white w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "กำลังบันทึก..." : "บันทึกรูปภาพ"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {croppedImage && (
                      <div>
                        <Label className="text-slate-200">ตัวอย่างรูปที่ครอป</Label>
                        <div className="border rounded-lg p-4 bg-slate-700">
                          <img
                            src={croppedImage}
                            alt="Cropped preview"
                            className="w-full max-w-xs mx-auto rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images by Category */}
            {categories.map((category) => {
              const categoryImages = getCategoryImages(category.value);
              return (
                <Card key={category.value} className="bg-slate-800/50 border-green-400/30 mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-green-400" />
                        <span className="text-green-400">{category.label}</span>
                      </div>
                      <span className="text-sm text-slate-300">
                        {categoryImages.length} รูปภาพ
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryImages.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        ยังไม่มีรูปภาพในหมวดหมู่นี้
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryImages.map((image) => (
                          <Card key={image.id} className="bg-slate-700 border-slate-600 hover:border-green-400 transition-colors">
                            <CardContent className="p-4">
                              <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-slate-600">
                                <img
                                  src={image.imageUrl}
                                  alt={image.answer}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-2">
                                <p className="font-bold text-green-400">{image.answer}</p>
                                <p className="text-xs text-slate-400">
                                  ไฟล์: {image.filename}
                                </p>
                                <div className="flex gap-2">
                                  {image.originalImageUrl && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(image.originalImageUrl, '_blank')}
                                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      รูปต้นฉบับ
                                    </Button>
                                  )}
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
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Image Cropper Modal */}
        {showCropper && previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-black">ครอปรูปภาพ</h3>
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
      </div>
    </div>
  );
};

export default AdminPage;
