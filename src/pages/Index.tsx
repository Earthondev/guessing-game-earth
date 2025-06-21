
import { Link } from "react-router-dom";
import { Settings, Play, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-16 h-16 text-rider-red mr-4 animate-glow-pulse" />
          <h1 className="text-4xl md:text-6xl font-orbitron font-black rider-text-glow">
            MASKED RIDER
          </h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-rider-gold mb-4">
          TILE PUZZLE
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          เกมทายภาพมาสค์ไรเดอร์ที่ท้าทายและสนุก เปิดเผยภาพทีละช่องและทายให้ถูก!
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link
          to="/game"
          className="admin-card hover:border-rider-red group transition-all duration-300"
        >
          <div className="text-center">
            <Play className="w-16 h-16 text-rider-red mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-orbitron font-bold text-rider-gold mb-2">
              เล่นเกม
            </h3>
            <p className="text-muted-foreground">
              เริ่มเล่นเกมทายภาพมาสค์ไรเดอร์
            </p>
          </div>
        </Link>

        <Link
          to="/admin"
          className="admin-card hover:border-rider-gold group transition-all duration-300"
        >
          <div className="text-center">
            <Settings className="w-16 h-16 text-rider-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-orbitron font-bold text-rider-red mb-2">
              จัดการรูปภาพ
            </h3>
            <p className="text-muted-foreground">
              อัปโหลดและจัดการรูปภาพสำหรับเกม
            </p>
          </div>
        </Link>
      </div>

      {/* Instructions */}
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h3 className="text-xl font-orbitron font-bold text-rider-gold mb-4">
          วิธีการเล่น
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="admin-card">
            <div className="text-3xl mb-2">📸</div>
            <h4 className="font-bold mb-2">1. อัปโหลดรูปภาพ</h4>
            <p className="text-muted-foreground">
              เพิ่มรูปภาพมาสค์ไรเดอร์และใส่คำเฉลย
            </p>
          </div>
          <div className="admin-card">
            <div className="text-3xl mb-2">🎮</div>
            <h4 className="font-bold mb-2">2. เล่นเกม</h4>
            <p className="text-muted-foreground">
              คลิกเพื่อเปิดช่องและเผยภาพทีละส่วน
            </p>
          </div>
          <div className="admin-card">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="font-bold mb-2">3. ทายให้ถูก</h4>
            <p className="text-muted-foreground">
              ทายชื่อมาสค์ไรเดอร์จากภาพที่เห็น
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
