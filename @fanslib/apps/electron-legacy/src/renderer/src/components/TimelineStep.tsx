import { cn } from "@renderer/lib/utils";

type TimelineStepProps = {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
  buttonSlot?: React.ReactNode;
};

export const TimelineStep = ({ stepNumber, title, children, buttonSlot }: TimelineStepProps) => {
  return (
    <div className="flex items-start gap-6">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "p-4 size-16 rounded-full flex items-center justify-center text-xl font-bold transition-colors border"
          )}
        >
          {stepNumber}
        </div>
        <div className="w-1 h-20 bg-gradient-to-b from-gray-300 to-gray-300 mt-3 rounded-full" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          {buttonSlot}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
