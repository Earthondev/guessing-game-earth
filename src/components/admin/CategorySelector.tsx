
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectorProps {
  categories: any[];
  selectedCategoryView: string;
  setSelectedCategoryView: (category: string) => void;
}

const CategorySelector = ({ categories, selectedCategoryView, setSelectedCategoryView }: CategorySelectorProps) => {
  return (
    <Card className="luxury-card border-gold/20 mb-8">
      <CardHeader>
        <CardTitle className="text-gold">เลือกหมวดหมู่เพื่อดูรูปภาพ</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedCategoryView} onValueChange={setSelectedCategoryView}>
          <SelectTrigger className="bg-rich-black-lighter border-gold/20 text-white hover:border-gold/40 transition-colors">
            <SelectValue placeholder="เลือกหมวดหมู่..." />
          </SelectTrigger>
          <SelectContent className="bg-rich-black border-gold/20 z-50">
            {categories.map((cat) => (
              <SelectItem key={cat.name} value={cat.name} className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                {cat.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
