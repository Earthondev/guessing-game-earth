
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gamepad2, Grid3X3, Trophy } from "lucide-react";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayModal = ({ isOpen, onClose }: HowToPlayModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-gold/20 backdrop-blur-lg bg-[#1a0505] shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(139,0,0,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-gold">
            <Gamepad2 className="w-7 h-7" />
            วิธีการเล่น
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            กติกาและวิธีการเล่นเกม Picture Guessing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-colors">
            <div className="p-2 bg-gold/10 rounded-full text-gold shrink-0">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">เลือกแผ่นป้าย</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                คลิกที่แผ่นป้ายเพื่อเปิดดูภาพด้านหลัง โดยมีทั้งหมด 25 แผ่นป้าย
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-colors">
            <div className="p-2 bg-gold/10 rounded-full text-gold shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">ระบบคะแนน</h3>
              <ul className="text-sm text-gray-400 list-disc pl-4 space-y-1 leading-relaxed">
                <li>เริ่มเกมพร้อม 25 คะแนน</li>
                <li>เปิด 1 แผ่นป้าย = <strong className="text-red-400">-5 คะแนน</strong></li>
                <li>เดาถูก = ได้คะแนนที่เหลือ</li>
                <li>เดาผิด = ไม่เสียคะแนนเพิ่ม</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-gold/70 italic py-1">
            "ยิ่งเปิดน้อย ยิ่งได้คะแนนเยอะ!"
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="luxury-button w-full font-bold py-3"
          >
            เข้าใจแล้ว! เริ่มเล่นเลย
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayModal;
