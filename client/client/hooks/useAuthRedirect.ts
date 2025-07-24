// hooks/useAuthRedirect.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/dashboard", { replace: true }); // Already logged in
    }
  }, []);
}
