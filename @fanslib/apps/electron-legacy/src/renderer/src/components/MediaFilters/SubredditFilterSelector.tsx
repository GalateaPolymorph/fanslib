import { SubredditSelect } from "../SubredditSelect";

type SubredditFilterSelectorProps = {
  value?: string;
  onChange: (subredditId: string) => void;
};

export const SubredditFilterSelector = ({ value, onChange }: SubredditFilterSelectorProps) => {
  const handleSubredditChange = (subredditIds: string[]) => {
    if (subredditIds.length > 0) {
      onChange(subredditIds[0]);
    }
  };

  return (
    <SubredditSelect
      value={value ? [value] : []}
      onChange={handleSubredditChange}
      multiple={false}
    />
  );
};
