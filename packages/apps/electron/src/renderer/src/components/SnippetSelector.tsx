import { Button } from "@renderer/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/DropdownMenu";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/Tooltip";
import { useQuery } from "@tanstack/react-query";
import { FileText, Globe } from "lucide-react";
import type { CaptionSnippet } from "src/features/snippets/entity";

type SnippetSelectorProps = {
  channelId?: string;
  caption: string;
  onCaptionChange: (caption: string) => void;
  className?: string;
};

export const SnippetSelector = ({
  channelId,
  caption = "",
  onCaptionChange,
  className,
}: SnippetSelectorProps) => {
  const { toast } = useToast();

  const { data: snippets = [] } = useQuery({
    queryKey: ["snippets", channelId],
    queryFn: () => {
      return channelId
        ? window.api["snippet:getSnippetsByChannel"](channelId)
        : window.api["snippet:getGlobalSnippets"]();
    },
  });

  const insertSnippet = async (snippet: CaptionSnippet) => {
    const prefix = caption && !caption.endsWith("\n") ? "\n\n" : "";
    const newCaption = `${caption}${prefix}${snippet.content}`;

    onCaptionChange(newCaption);

    // Increment usage count
    await window.api["snippet:incrementUsage"](snippet.id);

    toast({
      title: "Snippet inserted",
      description: `"${snippet.name}" has been added to the caption`,
    });
  };

  if (snippets.length === 0) return null;

  const globalSnippets = snippets.filter((s) => !s.channelId);
  const channelSnippets = snippets.filter((s) => s.channelId);

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={className}>
                <FileText className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Insert caption snippet</TooltipContent>

          <DropdownMenuContent align="end" className="w-64">
            {globalSnippets.length > 0 && (
              <>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  Global Snippets
                </DropdownMenuLabel>
                {globalSnippets.map((snippet) => (
                  <DropdownMenuItem
                    key={snippet.id}
                    onClick={() => insertSnippet(snippet)}
                    className="flex flex-col items-start gap-1 cursor-pointer"
                  >
                    <div className="font-medium">{snippet.name}</div>
                    <div className="text-xs text-muted-foreground truncate w-full">
                      {snippet.content.length > 50
                        ? `${snippet.content.slice(0, 50)}...`
                        : snippet.content}
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {channelSnippets.length > 0 && globalSnippets.length > 0 && <DropdownMenuSeparator />}

            {channelSnippets.length > 0 && (
              <>
                <DropdownMenuLabel>Channel Snippets</DropdownMenuLabel>
                {channelSnippets.map((snippet) => (
                  <DropdownMenuItem
                    key={snippet.id}
                    onClick={() => insertSnippet(snippet)}
                    className="flex flex-col items-start gap-1 cursor-pointer"
                  >
                    <div className="font-medium">{snippet.name}</div>
                    <div className="text-xs text-muted-foreground truncate w-full">
                      {snippet.content.length > 50
                        ? `${snippet.content.slice(0, 50)}...`
                        : snippet.content}
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};
