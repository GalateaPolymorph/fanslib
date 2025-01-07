import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-full flex-col p-8 justify-center">
      <div className="flex flex-col items-center text-center gap-1 mb-8">
        <Settings className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Welcome to FansLib</h1>
        <p>Library path is not set. Please configure it in settings.</p>
        <Button onClick={() => navigate("/settings")} className="flex items-center mt-4 gap-2">
          <Settings className="w-4 h-4" />
          Go to Settings
        </Button>
      </div>
    </div>
  );
};
