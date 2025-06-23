
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crop, RotateCcw, Check, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (originalFile: File, croppedFile: File) => void;
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

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, size: 200 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Convert imageUrl to File object when component mounts
  React.useEffect(() => {
    const fetchOriginalFile = async () => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'original-image.jpg', { type: blob.type });
        setOriginalFile(file);
      } catch (error) {
        console.error('Error converting image URL to File:', error);
      }
    };

    fetchOriginalFile();
  }, [imageUrl]);

  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate initial crop box size as a square (1:1 ratio)
      const maxSize = Math.min(containerRect.width, containerRect.height) * 0.6;
      const initialSize = Math.min(maxSize, img.offsetWidth * 0.6, img.offsetHeight * 0.6);
      
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
    if (!containerRef.current || !imageRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const relativeY = e.clientY - containerRect.top;

    // Calculate image bounds within container
    const imgOffsetX = imgRect.left - containerRect.left;
    const imgOffsetY = imgRect.top - containerRect.top;
    const imgWidth = imgRect.width * zoom;
    const imgHeight = imgRect.height * zoom;

    if (isDragging) {
      const newX = Math.max(imgOffsetX, Math.min(relativeX - cropBox.size / 2, imgOffsetX + imgWidth - cropBox.size));
      const newY = Math.max(imgOffsetY, Math.min(relativeY - cropBox.size / 2, imgOffsetY + imgHeight - cropBox.size));
      
      setCropBox(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const centerX = cropBox.x + cropBox.size / 2;
      const centerY = cropBox.y + cropBox.size / 2;
      
      const distanceX = Math.abs(relativeX - centerX);
      const distanceY = Math.abs(relativeY - centerY);
      const maxDistance = Math.max(distanceX, distanceY);
      
      // Ensure square aspect ratio (1:1) and stay within image bounds
      let newSize = Math.min(
        Math.max(maxDistance * 2, 50),
        imgWidth,
        imgHeight
      );
      
      // Adjust position to keep crop box within image bounds
      const newX = Math.max(imgOffsetX, Math.min(centerX - newSize / 2, imgOffsetX + imgWidth - newSize));
      const newY = Math.max(imgOffsetY, Math.min(centerY - newSize / 2, imgOffsetY + imgHeight - newSize));
      
      // Recalculate size if position was adjusted
      const maxSizeFromX = Math.min(newSize, (imgOffsetX + imgWidth - newX) * 2, (newX - imgOffsetX + newSize) * 2);
      const maxSizeFromY = Math.min(newSize, (imgOffsetY + imgHeight - newY) * 2, (newY - imgOffsetY + newSize) * 2);
      newSize = Math.min(maxSizeFromX, maxSizeFromY);
      
      setCropBox({ x: newX, y: newY, size: newSize });
    }
  }, [isDragging, isResizing, cropBox, zoom]);

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
    if (containerRef.current && imageRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imageRef.current.getBoundingClientRect();
      const imgOffsetX = imgRect.left - containerRect.left;
      const imgOffsetY = imgRect.top - containerRect.top;
      
      const maxSize = Math.min(imgRect.width, imgRect.height) * 0.6;
      const initialSize = Math.max(50, maxSize);
      
      setCropBox({
        x: imgOffsetX + (imgRect.width - initialSize) / 2,
        y: imgOffsetY + (imgRect.height - initialSize) / 2,
        size: initialSize
      });
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleCropConfirm = async () => {
    if (!imageRef.current || !containerRef.current || !originalFile) return;

    try {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      
      // Calculate scale factors
      const scaleX = img.naturalWidth / (imgRect.width * zoom);
      const scaleY = img.naturalHeight / (imgRect.height * zoom);
      
      // Calculate crop coordinates relative to actual image
      const imgOffsetX = imgRect.left - containerRect.left;
      const imgOffsetY = imgRect.top - containerRect.top;
      
      const cropData: CropData = {
        x: (cropBox.x - imgOffsetX) * scaleX,
        y: (cropBox.y - imgOffsetY) * scaleY,
        width: cropBox.size * scaleX,
        height: cropBox.size * scaleY, // Keep it square
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      };

      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');
      
      // Set canvas size to square dimensions
      const outputSize = 512; // Fixed output size for consistency
      canvas.width = outputSize;
      canvas.height = outputSize;
      
      // Create image element for canvas
      const imgElement = new Image();
      imgElement.onload = () => {
        ctx.drawImage(
          imgElement,
          cropData.x, cropData.y, cropData.width, cropData.height,
          0, 0, outputSize, outputSize
        );
        
        // Convert canvas to blob and create File object
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            onCropComplete(originalFile, croppedFile);
          }
        }, 'image/jpeg', 0.9);
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
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Crop className="w-5 h-5" />
          ครอปรูปภาพสำหรับเกม (1:1)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={containerRef}
          className="relative bg-gray-100 rounded-lg overflow-hidden"
          style={{ height: '400px' }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Image to crop"
            className="w-full h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            onLoad={handleImageLoad}
          />
          
          {imageLoaded && (
            <>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />
              
              {/* Crop Box - Always Square */}
              <div
                className="absolute border-2 border-blue-500 bg-transparent cursor-move transition-all duration-200 hover:border-blue-400"
                style={{
                  left: `${cropBox.x}px`,
                  top: `${cropBox.y}px`,
                  width: `${cropBox.size}px`,
                  height: `${cropBox.size}px`, // Force square
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-blue-400 opacity-30" />
                  ))}
                </div>
                
                {/* Resize handles - corners only for square cropping */}
                <div
                  className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 cursor-nw-resize hover:bg-blue-400 transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
                />
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 cursor-ne-resize hover:bg-blue-400 transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
                />
                <div
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 cursor-sw-resize hover:bg-blue-400 transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 cursor-se-resize hover:bg-blue-400 transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
                />
              </div>
            </>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Button
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-700 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-700">
          <p>💡 <strong>คำแนะนำ:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>ลากกรอบสี่เหลี่ยมเพื่อเลือกตำแหน่งที่ต้องการ</li>
            <li>ลากมุมกรอบเพื่อปรับขนาด (คงอัตราส่วน 1:1)</li>
            <li>ใช้ปุ่มซูมเพื่อขยาย/ย่อรูปภาพ</li>
            <li>เลือกส่วนที่สำคัญของรูปภาพเพื่อเพิ่มความยาก</li>
            <li>รูปภาพจะถูกครอปเป็นสี่เหลี่ยมจัตุรัสเสมอ</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={resetCrop}
            variant="outline"
            className="border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-black"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            รีเซ็ตตำแหน่ง
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            ยกเลิก
          </Button>
          
          <Button
            onClick={handleCropConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
            disabled={!imageLoaded || !originalFile}
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
