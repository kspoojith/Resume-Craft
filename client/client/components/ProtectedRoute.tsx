import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }

    setLoading(false);
  }, []);

  if (loading) return <div className="text-center p-8">Checking authentication...</div>;

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
