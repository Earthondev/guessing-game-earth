
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface MultiAnswerInputProps {
  answers: string[];
  onChange: (answers: string[]) => void;
  label?: string;
}

const MultiAnswerInput = ({ answers, onChange, label = "คำตอบที่ยอมรับได้" }: MultiAnswerInputProps) => {
  const [newAnswer, setNewAnswer] = useState("");

  const addAnswer = () => {
    if (newAnswer.trim() && !answers.includes(newAnswer.trim())) {
      onChange([...answers, newAnswer.trim()]);
      setNewAnswer("");
    }
  };

  const removeAnswer = (index: number) => {
    onChange(answers.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAnswer();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-black font-medium">{label}</label>
      
      <div className="flex gap-2">
        <Input
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="เพิ่มคำตอบ..."
          className="bg-white border-gray-300 text-black"
        />
        <Button
          type="button"
          onClick={addAnswer}
          disabled={!newAnswer.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {answers.map((answer, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-200 text-black">
            {answer}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAnswer(index)}
              className="h-4 w-4 p-0 hover:bg-red-100"
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {answers.length === 0 && (
        <p className="text-sm text-gray-500">ยังไม่มีคำตอบ กรุณาเพิ่มอย่างน้อย 1 คำตอบ</p>
      )}
    </div>
  );
};

export default MultiAnswerInput;
