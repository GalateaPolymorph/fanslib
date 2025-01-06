import { useRef, type ReactNode } from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

type SplitViewLayoutProps = {
  mainContent: ReactNode;
  sideContent: ReactNode;
  sideContentHeader?: ReactNode;
  mainDefaultSize?: number;
  sideDefaultSize?: number;
  mainMinSize?: number;
  sideMinSize?: number;
  sideMaxSize?: number;
};

export const SplitViewLayout = ({
  mainContent,
  sideContent,
  sideContentHeader,
  mainDefaultSize = 70,
  sideDefaultSize = 30,
  mainMinSize = 30,
  sideMinSize = 3,
  sideMaxSize = 40,
}: SplitViewLayoutProps) => {
  const panelGroupRef = useRef<ResizablePrimitive.ImperativePanelGroupHandle>(null);

  return (
    <div className="h-full w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" ref={panelGroupRef}>
        <ResizablePanel 
          defaultSize={mainDefaultSize} 
          minSize={mainMinSize} 
          panelIndex={0} 
          groupRef={panelGroupRef}
        >
          {mainContent}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={sideDefaultSize}
          minSize={sideMinSize}
          maxSize={sideMaxSize}
          collapsible
          headerSlot={sideContentHeader}
          panelIndex={1}
          groupRef={panelGroupRef}
        >
          {sideContent}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
