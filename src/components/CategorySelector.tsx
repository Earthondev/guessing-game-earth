
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface GameCategory {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
}

interface CategorySelectorProps {
  categories: GameCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  onStartGame: () => void;
}

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onStartGame 
}: CategorySelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-orbitron font-bold text-rider-gold mb-2">
          เลือกหมวดหมู่เกม
        </h2>
        <p className="text-muted-foreground">
          เลือกหมวดหมู่ที่คุณต้องการเล่น
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedCategory === category.id
                ? `border-2 border-${category.color} bg-gradient-to-br from-${category.color}/20 to-transparent`
                : 'admin-card hover:border-rider-gold'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-orbitron font-bold text-lg mb-2">
                {category.displayName}
              </h3>
              <p className="text-sm text-muted-foreground">
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
            className="hero-button text-lg px-8 py-3 hover:scale-105 transition-all duration-300"
          >
            🎮 เริ่มเกม
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
