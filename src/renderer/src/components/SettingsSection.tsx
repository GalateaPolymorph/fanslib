import { cn } from "@renderer/lib/utils";

interface SettingsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsSection = ({
  title,
  description,
  children,
  className,
  ...props
}: SettingsSectionProps) => {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};
