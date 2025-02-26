import { cn } from "@renderer/lib/utils";
import { gridClasses } from "./table";

export const SubredditTableHeader = () => {
  return (
    <div className={cn(gridClasses, "border-b")}>
      <div className="p-2 pl-4 h-12 flex items-center text-muted-foreground">Name</div>
      <div className="p-2 h-12 flex items-center text-muted-foreground">Members</div>
      <div className="p-2 h-12 flex items-center text-muted-foreground">Post Frequency (hrs)</div>
      <div className="p-2 h-12 flex items-center text-muted-foreground">Verification</div>
      <div className="p-2 h-12 flex items-center text-muted-foreground">Notes</div>
      <div></div>
    </div>
  );
};
