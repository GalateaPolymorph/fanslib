import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const MouseBackButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseBack = (e: MouseEvent) => {
      if (e.buttons === 8) {
        // Mouse back button
        navigate(-1);
      }
    };

    window.addEventListener("mousedown", handleMouseBack);
    return () => window.removeEventListener("mousedown", handleMouseBack);
  }, [navigate]);

  return null;
};
