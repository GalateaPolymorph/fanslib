import { Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const ShootViewSettings = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>View Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="flex items-center justify-between"></div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
