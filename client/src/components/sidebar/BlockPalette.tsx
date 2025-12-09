import { useState, useMemo } from "react";
import { Search, Layers, Zap, GitMerge, Brain, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { BLOCK_DEFINITIONS, getBlocksByCategory } from "@/lib/blocks";
import type { BlockCategory, BlockDefinition } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const categoryConfig: Record<BlockCategory, { label: string; icon: typeof Layers; color: string }> = {
  layer: { label: "Layers", icon: Layers, color: "text-blue-500" },
  activation: { label: "Activations", icon: Zap, color: "text-emerald-500" },
  operation: { label: "Operations", icon: GitMerge, color: "text-amber-500" },
  attention: { label: "Attention", icon: Brain, color: "text-purple-500" },
};

interface BlockItemProps {
  block: BlockDefinition;
}

function BlockItem({ block }: BlockItemProps) {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/neuro-canvas-block", block.type);
    event.dataTransfer.effectAllowed = "move";
  };

  const config = categoryConfig[block.category];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          draggable
          onDragStart={onDragStart}
          className={cn(
            "flex items-center gap-2 px-3 h-10 rounded-md cursor-grab",
            "hover-elevate active-elevate-2",
            "select-none transition-colors duration-150"
          )}
          data-testid={`palette-block-${block.type}`}
        >
          <config.icon className={cn("w-4 h-4", config.color)} />
          <span className="text-sm font-medium truncate">{block.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[280px] p-3">
        <p className="text-sm font-medium">{block.label}</p>
        <p className="text-xs text-muted-foreground mt-1">{block.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface CategorySectionProps {
  category: BlockCategory;
  blocks: BlockDefinition[];
  searchQuery: string;
}

function CategorySection({ category, blocks, searchQuery }: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const config = categoryConfig[category];
  const Icon = config.icon;

  const filteredBlocks = useMemo(() => {
    if (!searchQuery) return blocks;
    return blocks.filter(
      (b) =>
        b.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blocks, searchQuery]);

  if (filteredBlocks.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-2">
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 hover-elevate rounded-md">
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <Icon className={cn("w-4 h-4", config.color)} />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {config.label}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {filteredBlocks.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1 mt-1">
        {filteredBlocks.map((block) => (
          <BlockItem key={block.type} block={block} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function BlockPalette() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories: BlockCategory[] = ["layer", "activation", "operation", "attention"];

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Block Library
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-background"
            data-testid="input-search-blocks"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            blocks={getBlocksByCategory(category)}
            searchQuery={searchQuery}
          />
        ))}
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          Drag blocks onto the canvas
        </p>
      </div>
    </div>
  );
}
