
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



  return (
    <div className="space-y-3">
      <label className="text-gray-300 font-medium">{label}</label>

      <div className="flex gap-2">
        <Input
          value={newAnswer}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAnswer(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addAnswer();
            }
          }}
          placeholder="เพิ่มคำตอบ..."
          className="bg-rich-black-lighter border-gold/20 text-white focus:border-gold/50 placeholder:text-gray-500"
        />
        <Button
          type="button"
          onClick={addAnswer}
          disabled={!newAnswer.trim()}
          className="bg-luxury-red hover:bg-luxury-red/80 text-white border border-luxury-red/50"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {answers.map((answer, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gold/10 text-gold border border-gold/20 px-3 py-1">
            {answer}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAnswer(index)}
              className="h-4 w-4 p-0 hover:bg-red-500/20 text-red-400 hover:text-red-300 ml-1 rounded-full transition-colors"
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
