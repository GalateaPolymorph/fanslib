import { gridClasses } from "./table";

export const SubredditTableHeader = () => {
  return (
    <div className={gridClasses}>
      <div className="p-2 pl-4 font-medium"></div>
      <div className="p-2 pl-4 font-medium">Name</div>
      <div className="p-2 font-medium">Members</div>
      <div className="p-2 font-medium">Post Frequency (hours)</div>
      <div className="p-2 font-medium">Post Status</div>
      <div className="p-2 font-medium">Verification</div>
      <div className="p-2 font-medium">Notes</div>
      <div className="p-2 pr-4 font-medium"></div>
    </div>
  );
};
