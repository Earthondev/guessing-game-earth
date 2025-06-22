
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
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
          เลือกหมวดหมู่ที่คุณต้องการเล่น
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedCategory === category.id
                ? 'border-2 border-green-400 bg-gradient-to-br from-green-400/20 to-transparent'
                : 'bg-slate-800/50 border-slate-600 hover:border-green-400'
            }`}
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

      {selectedCategory && (
        <div className="text-center animate-fade-in">
          <Button
            onClick={onStartGame}
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 hover:scale-105 transition-all duration-300"
          >
            🎮 เริ่มเกม
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
