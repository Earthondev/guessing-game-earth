
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crop, RotateCcw, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (originalFile: File, croppedFile: File, cropData: CropData) => void;
  onCancel: () => void;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageFile, onCropComplete, onCancel }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, size: 200 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate initial crop box size (about 40% of container)
      const initialSize = Math.min(containerRect.width, containerRect.height) * 0.4;
      
      setCropBox({
        x: (containerRect.width - initialSize) / 2,
        y: (containerRect.height - initialSize) / 2,
        size: initialSize
      });
      
      setImageLoaded(true);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    if (action === 'drag') {
      setIsDragging(true);
    } else if (action === 'resize') {
      setIsResizing(true);
      setResizeHandle(handle || '');
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const relativeY = e.clientY - containerRect.top;

    if (isDragging) {
      const newX = Math.max(0, Math.min(relativeX - cropBox.size / 2, containerRect.width - cropBox.size));
      const newY = Math.max(0, Math.min(relativeY - cropBox.size / 2, containerRect.height - cropBox.size));
      
      setCropBox(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const centerX = cropBox.x + cropBox.size / 2;
      const centerY = cropBox.y + cropBox.size / 2;
      
      const distanceX = Math.abs(relativeX - centerX);
      const distanceY = Math.abs(relativeY - centerY);
      const maxDistance = Math.max(distanceX, distanceY);
      
      const newSize = Math.min(
        Math.max(maxDistance * 2, 50),
        Math.min(containerRect.width, containerRect.height)
      );
      
      const newX = Math.max(0, Math.min(centerX - newSize / 2, containerRect.width - newSize));
      const newY = Math.max(0, Math.min(centerY - newSize / 2, containerRect.height - newSize));
      
      setCropBox({ x: newX, y: newY, size: newSize });
    }
  }, [isDragging, isResizing, cropBox]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const resetCrop = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const initialSize = Math.min(containerRect.width, containerRect.height) * 0.4;
      
      setCropBox({
        x: (containerRect.width - initialSize) / 2,
        y: (containerRect.height - initialSize) / 2,
        size: initialSize
      });
    }
  };

  const handleCropConfirm = async () => {
    if (!imageRef.current || !containerRef.current) return;

    try {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate crop coordinates relative to actual image
      const scaleX = img.naturalWidth / img.offsetWidth;
      const scaleY = img.naturalHeight / img.offsetHeight;
      
      const cropData: CropData = {
        x: cropBox.x * scaleX,
        y: cropBox.y * scaleY,
        width: cropBox.size * scaleX,
        height: cropBox.size * scaleY,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      };

      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');
      
      canvas.width = cropData.width;
      canvas.height = cropData.height;
      
      // Create image element for canvas
      const imgElement = new Image();
      imgElement.onload = () => {
        ctx.drawImage(
          imgElement,
          cropData.x, cropData.y, cropData.width, cropData.height,
          0, 0, cropData.width, cropData.height
        );
        
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], `cropped_${imageFile.name}`, { type: imageFile.type });
            onCropComplete(imageFile, croppedFile, cropData);
          }
        }, imageFile.type, 0.9);
      };
      
      imgElement.src = imageUrl;
      
    } catch (error) {
      console.error('Error cropping image:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถครอปรูปภาพได้",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="admin-card border-rider-gold">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rider-gold">
          <Crop className="w-5 h-5" />
          ครอปรูปภาพสำหรับเกม
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={containerRef}
          className="relative bg-black rounded-lg overflow-hidden"
          style={{ height: '400px' }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Image to crop"
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
          />
          
          {imageLoaded && (
            <>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />
              
              {/* Crop Box */}
              <div
                className="absolute border-2 border-rider-gold bg-transparent cursor-move transition-all duration-200 hover:border-rider-gold-light"
                style={{
                  left: `${cropBox.x}px`,
                  top: `${cropBox.y}px`,
                  width: `${cropBox.size}px`,
                  height: `${cropBox.size}px`,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-rider-gold opacity-30" />
                  ))}
                </div>
                
                {/* Resize handles */}
                <div
                  className="absolute -top-1 -left-1 w-3 h-3 bg-rider-gold cursor-nw-resize hover:bg-rider-gold-light transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
                />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-rider-gold cursor-ne-resize hover:bg-rider-gold-light transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
                />
                <div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-rider-gold cursor-sw-resize hover:bg-rider-gold-light transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-rider-gold cursor-se-resize hover:bg-rider-gold-light transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
                />
              </div>
            </>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>💡 <strong>คำแนะนำ:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>ลากกรอบสี่เหลี่ยมเพื่อเลือกตำแหน่งที่ต้องการ</li>
            <li>ลากมุมกรอบเพื่อปรับขนาด</li>
            <li>เลือกส่วนที่สำคัญของมาสค์ไรเดอร์เพื่อเพิ่มความยาก</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={resetCrop}
            variant="outline"
            className="border-rider-metal text-rider-metal hover:bg-rider-metal hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            รีเซ็ตตำแหน่ง
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-rider-red text-rider-red hover:bg-rider-red hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            ยกเลิก
          </Button>
          
          <Button
            onClick={handleCropConfirm}
            className="hero-button flex-1"
            disabled={!imageLoaded}
          >
            <Check className="w-4 h-4 mr-2" />
            ยืนยันการครอป
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCropper;
