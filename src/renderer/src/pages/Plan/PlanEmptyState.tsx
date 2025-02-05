import { Link } from "react-router-dom";

export const PlanEmptyState = () => (
  <div className="text-center text-muted-foreground py-8">
    You don&apos;t have any channels to post your content to yet.
    <br />
    Go to the{" "}
    <Link to="/channels" className="underline">
      channels page
    </Link>{" "}
    to add one.
  </div>
);
