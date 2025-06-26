
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectorProps {
  categories: any[];
  selectedCategoryView: string;
  setSelectedCategoryView: (category: string) => void;
}

const CategorySelector = ({ categories, selectedCategoryView, setSelectedCategoryView }: CategorySelectorProps) => {
  return (
    <Card className="bg-white border-gray-300 mb-8">
      <CardHeader>
        <CardTitle className="text-black">เลือกหมวดหมู่เพื่อดูรูปภาพ</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedCategoryView} onValueChange={setSelectedCategoryView}>
          <SelectTrigger className="bg-white border-gray-300 text-black">
            <SelectValue placeholder="เลือกหมวดหมู่..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.name} value={cat.name}>
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
