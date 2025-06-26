
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon" className="hover:scale-105 transition-transform border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-black">
            ระบบจัดการเกม
          </h1>
          <p className="text-sm text-gray-600">
            จัดการหมวดหมู่และรูปภาพสำหรับเกม
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
