
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <Card className="bg-white border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black">กำลังตรวจสอบสิทธิ์...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
