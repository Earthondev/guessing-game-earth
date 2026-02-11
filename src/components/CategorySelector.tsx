
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
          <h2 className="text-2xl font-heading font-semibold text-primary mb-2">
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
          <h2 className="text-2xl font-heading font-semibold text-muted-foreground mb-2">
            ยังไม่มีหมวดหมู่เกม
          </h2>
          <p className="text-muted-foreground">
            ผู้ดูแลระบบสามารถเพิ่มหมวดหมู่ใหม่ได้ในหน้าจัดการระบบ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group relative cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-luxury-red via-gold to-luxury-red opacity-50 blur opacity-75 transition duration-500 group-hover:duration-200"></div>
            <div className="relative h-full bg-rich-black border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-[4/3] overflow-hidden">
                {category.coverImage ? (
                  <img
                    src={category.coverImage}
                    alt={category.displayName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-6xl text-gold/50 group-hover:text-gold/80 transition-colors">
                    {category.icon}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl filter drop-shadow-lg">{category.icon}</span>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-gold transition-colors drop-shadow-md">
                    {category.displayName}
                  </h3>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2 font-light group-hover:text-white transition-colors">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
