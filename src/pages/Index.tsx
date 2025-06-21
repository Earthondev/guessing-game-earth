
import { Link } from "react-router-dom";
import { Settings, Play, Shield, Gamepad2, Wrench, Trophy } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-8">
          <div className="premium-logo mr-6">
            <img 
              src="/lovable-uploads/ac86de65-c0ad-4f16-9e15-fb6d310dfff0.png" 
              alt="Kamen Rider Logo" 
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-orbitron font-black rider-text-glow leading-tight">
              MASKED RIDER
            </h1>
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold metallic-text mt-2">
              TILE PUZZLE
            </h2>
          </div>
        </div>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          เกมทายภาพมาสค์ไรเดอร์ที่ท้าทายและสนุก เปิดเผยภาพทีละช่องและทายให้ถูก!
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mb-16">
        <Link
          to="/game"
          className="admin-card hover:border-rider-red group transition-all duration-500 circuit-pattern"
        >
          <div className="text-center relative z-10">
            <div className="relative mb-6">
              <Play className="w-20 h-20 text-rider-red mx-auto group-hover:scale-110 transition-all duration-300" />
              <div className="absolute inset-0 w-20 h-20 mx-auto bg-rider-red opacity-20 rounded-full blur-xl group-hover:opacity-30 transition-all duration-300"></div>
            </div>
            <h3 className="text-3xl font-orbitron font-bold metallic-text mb-4">
              เล่นเกม
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              เริ่มเล่นเกมทายภาพมาสค์ไรเดอร์<br />
              ท้าทายสมองและความจำของคุณ
            </p>
            <div className="mt-4 inline-flex items-center text-rider-red font-semibold">
              <Gamepad2 className="w-4 h-4 mr-2" />
              เริ่มเล่นทันที
            </div>
          </div>
        </Link>

        <Link
          to="/admin"
          className="admin-card hover:border-rider-gold group transition-all duration-500 circuit-pattern"
        >
          <div className="text-center relative z-10">
            <div className="relative mb-6">
              <Settings className="w-20 h-20 text-rider-gold mx-auto group-hover:scale-110 transition-all duration-300" />
              <div className="absolute inset-0 w-20 h-20 mx-auto bg-rider-gold opacity-20 rounded-full blur-xl group-hover:opacity-30 transition-all duration-300"></div>
            </div>
            <h3 className="text-3xl font-orbitron font-bold text-rider-red mb-4">
              จัดการรูปภาพ
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              อัปโหลดและจัดการรูปภาพ<br />
              สำหรับเกมของคุณ
            </p>
            <div className="mt-4 inline-flex items-center text-rider-gold font-semibold">
              <Wrench className="w-4 h-4 mr-2" />
              จัดการเนื้อหา
            </div>
          </div>
        </Link>
      </div>

      {/* Instructions */}
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-2xl font-orbitron font-bold metallic-text mb-8">
          วิธีการเล่น
        </h3>
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div className="admin-card circuit-pattern group">
            <div className="relative z-10">
              <div className="text-5xl mb-4">📸</div>
              <div className="w-12 h-1 bg-gradient-to-r from-rider-red to-rider-gold mx-auto mb-4 rounded-full"></div>
              <h4 className="font-orbitron font-bold mb-3 text-lg text-white">1. อัปโหลดรูปภาพ</h4>
              <p className="text-slate-300 leading-relaxed">
                เพิ่มรูปภาพมาสค์ไรเดอร์และใส่คำเฉลย<br />
                สูงสุด 10 รูปต่อชุด
              </p>
            </div>
          </div>
          <div className="admin-card circuit-pattern group">
            <div className="relative z-10">
              <div className="text-5xl mb-4">🎮</div>
              <div className="w-12 h-1 bg-gradient-to-r from-rider-red to-rider-gold mx-auto mb-4 rounded-full"></div>
              <h4 className="font-orbitron font-bold mb-3 text-lg text-white">2. เล่นเกม</h4>
              <p className="text-slate-300 leading-relaxed">
                คลิกเพื่อเปิดช่องและเผยภาพ<br />
                ทีละส่วนในตาราง 5x5
              </p>
            </div>
          </div>
          <div className="admin-card circuit-pattern group">
            <div className="relative z-10">
              <div className="text-5xl mb-4">🏆</div>
              <div className="w-12 h-1 bg-gradient-to-r from-rider-red to-rider-gold mx-auto mb-4 rounded-full"></div>
              <h4 className="font-orbitron font-bold mb-3 text-lg text-white">3. ทายให้ถูก</h4>
              <p className="text-slate-300 leading-relaxed">
                ทายชื่อมาสค์ไรเดอร์จากภาพ<br />
                ที่เห็นและรับคะแนน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
