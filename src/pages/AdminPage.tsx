
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ImageData {
  id: string;
  imageUrl: string;
  answer: string;
  file?: File;
}

const AdminPage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (images.length + files.length > 10) {
      toast({
        title: "เกินขีดจำกัด",
        description: "สามารถอัปโหลดได้สูงสุด 10 รูปภาพเท่านั้น",
        variant: "destructive",
      });
      return;
    }

    const newImages: ImageData[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      
      newImages.push({
        id: `img_${Date.now()}_${i}`,
        imageUrl,
        answer: "",
        file,
      });
    }
    
    setImages(prev => [...prev, ...newImages]);
    
    toast({
      title: "อัปโหลดสำเร็จ",
      description: `เพิ่มรูปภาพ ${newImages.length} รูป`,
    });
  };

  const updateAnswer = (id: string, answer: string) => {
    setImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, answer } : img
      )
    );
  };

  const deleteImage = (id: string) => {
    setImages(prev => {
      const imageToDelete = prev.find(img => img.id === id);
      if (imageToDelete?.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageToDelete.imageUrl);
      }
      return prev.filter(img => img.id !== id);
    });
    
    toast({
      title: "ลบสำเร็จ",
      description: "ลบรูปภาพแล้ว",
    });
  };

  const saveImages = () => {
    const validImages = images.filter(img => img.answer.trim() !== "");
    
    if (validImages.length === 0) {
      toast({
        title: "ไม่มีข้อมูล",
        description: "กรุณาเพิ่มรูปภาพและใส่คำเฉลยก่อน",
        variant: "destructive",
      });
      return;
    }

    // Store in localStorage for now (will be replaced with Supabase)
    localStorage.setItem('maskedRiderImages', JSON.stringify(validImages));
    
    toast({
      title: "บันทึกสำเร็จ",
      description: `บันทึกรูปภาพ ${validImages.length} รูป`,
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-orbitron font-bold text-rider-gold">
              จัดการรูปภาพ
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {images.length}/10 รูปภาพ
          </div>
        </div>

        {/* Upload Section */}
        <Card className="admin-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              อัปโหลดรูปภาพ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload">เลือกรูปภาพมาสค์ไรเดอร์</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={images.length >= 10}
                  className="mt-2"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                รองรับไฟล์ JPG, PNG, GIF (สูงสุด 10 รูป)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {images.map((image) => (
              <Card key={image.id} className="admin-card">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image.imageUrl}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => deleteImage(image.id)}
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
                      onChange={(e) => updateAnswer(image.id, e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
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

        {/* Save Button */}
        {images.length > 0 && (
          <div className="text-center">
            <Button onClick={saveImages} className="hero-button">
              <Save className="w-4 h-4 mr-2" />
              บันทึกรูปภาพทั้งหมด
            </Button>
          </div>
        )}

        {/* Supabase Notice */}
        <Card className="admin-card mt-8 border-rider-gold">
          <CardContent className="p-6">
            <h3 className="font-bold text-rider-gold mb-2">📋 หมายเหตุสำคัญ</h3>
            <p className="text-sm text-muted-foreground">
              ปัจจุบันข้อมูลจะถูกเก็บใน Local Storage ชั่วคราว 
              หากต้องการเก็บข้อมูลแบบถาวรและแชร์ได้ กรุณาเชื่อมต่อกับ Supabase 
              ผ่านปุ่มสีเขียวที่มุมขวาบนของหน้าจอ
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
