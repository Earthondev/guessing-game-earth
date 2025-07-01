
import { Card, CardContent } from "@/components/ui/card";

export interface GameCategory {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  coverImage?: string;
}

interface CategorySelectorProps {
  categories: GameCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  onStartGame: () => void;
  loading?: boolean;
}

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onStartGame,
  loading = false
}: CategorySelectorProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-orbitron font-bold text-green-400 mb-2">
            กำลังโหลดหมวดหมู่...
          </h2>
        </div>
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/335da3d0-e2ee-42b1-9641-23af0f38de4a.png" 
            alt="Loading..." 
            className="w-16 h-16 animate-bounce"
          />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-orbitron font-bold text-green-400 mb-2">
            ยังไม่มีหมวดหมู่เกม
          </h2>
          <p className="text-slate-300">
            ผู้ดูแลระบบสามารถเพิ่มหมวดหมู่ใหม่ได้ในหน้าจัดการระบบ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-orbitron font-bold text-green-400 mb-2">
          เลือกหมวดหมู่เกม
        </h2>
        <p className="text-slate-300">
          คลิกเพื่อเริ่มเล่นเกม 10 รอบทันที!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer transition-all duration-300 hover:scale-105 bg-slate-800/50 border-slate-600 hover:border-green-400"
            onClick={() => onSelectCategory(category.id)}
          >
            <CardContent className="p-4">
              {category.coverImage ? (
                <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                  <img
                    src={category.coverImage}
                    alt={category.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square mb-3 bg-slate-700 rounded-lg flex items-center justify-center">
                  <div className="text-4xl">{category.icon}</div>
                </div>
              )}
              <h3 className="font-orbitron font-bold text-lg mb-2 text-center text-green-400">
                {category.displayName}
              </h3>
              <p className="text-sm text-slate-300 text-center">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
