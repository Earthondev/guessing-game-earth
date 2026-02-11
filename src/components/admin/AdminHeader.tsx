
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon" className="hover:scale-105 transition-transform border-gold text-gold hover:bg-gold hover:text-rich-black">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-gold drop-shadow-md">
            ระบบจัดการเกม
          </h1>
          <p className="text-sm text-gray-400 font-light">
            จัดการหมวดหมู่และรูปภาพสำหรับเกม
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
