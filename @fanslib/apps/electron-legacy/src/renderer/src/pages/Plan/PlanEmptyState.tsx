import { Link } from "react-router-dom";
import { EmptyState } from "@renderer/components/ui/EmptyState/EmptyState";
import { Button } from "@renderer/components/ui/Button";
import { PlusCircle, Calendar } from "lucide-react";

export const PlanEmptyState = () => (
  <EmptyState
    icon={<Calendar className="h-12 w-12" />}
    title="No channels configured"
    description="You don't have any channels to post your content to yet."
    action={
      <Button asChild>
        <Link to="/channels">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Channel
        </Link>
      </Button>
    }
  />
);
