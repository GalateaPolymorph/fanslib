import { ShootSelect } from "../ShootSelect";

type ShootFilterSelectorProps = {
  value?: string;
  onChange: (shootId: string) => void;
};

export const ShootFilterSelector = ({ value, onChange }: ShootFilterSelectorProps) => {
  const handleShootChange = (shootIds: string[]) => {
    if (shootIds.length > 0) {
      onChange(shootIds[0]);
    }
  };

  return (
    <ShootSelect
      value={value ? [value] : []}
      onChange={handleShootChange}
      multiple={false}
      omitAllShoots={true}
      placeholder="Select a shoot..."
    />
  );
};
