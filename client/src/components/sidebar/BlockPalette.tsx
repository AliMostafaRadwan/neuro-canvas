import { useState, useMemo } from "react";
import { Search, Layers, Zap, GitMerge, Brain, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BLOCK_DEFINITIONS, getBlocksByCategory } from "@/lib/blocks";
import type { BlockCategory, BlockDefinition } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const categoryConfig: Record<BlockCategory, { label: string; icon: typeof Layers; color: string; bgColor: string }> = {
  layer: { 
    label: "Layers", 
    icon: Layers, 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20"
  },
  activation: { 
    label: "Activations", 
    icon: Zap, 
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20"
  },
  operation: { 
    label: "Operations", 
    icon: GitMerge, 
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 hover:bg-amber-500/20"
  },
  attention: { 
    label: "Attention", 
    icon: Brain, 
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20"
  },
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
            "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab",
            config.bgColor,
            "border border-transparent hover:border-border/50",
            "select-none transition-all duration-150",
            "hover:shadow-sm active:cursor-grabbing active:scale-[0.98]"
          )}
          data-testid={`palette-block-${block.type}`}
        >
          <config.icon className={cn("w-4 h-4 shrink-0", config.color)} />
          <span className="text-sm font-medium truncate">{block.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[280px] p-3">
        <p className="text-sm font-semibold">{block.label}</p>
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
      <CollapsibleTrigger className={cn(
        "flex items-center justify-between w-full px-3 py-2 rounded-lg",
        "hover:bg-accent/50 transition-colors group"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", config.bgColor)}>
            <Icon className={cn("w-3.5 h-3.5", config.color)} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {config.label}
          </span>
          <span className="text-[10px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-full">
            {filteredBlocks.length}
          </span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 space-y-1 pl-1">
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
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-bold mb-3 text-sidebar-foreground">Block Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border focus:bg-background"
            data-testid="input-search-blocks"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            blocks={getBlocksByCategory(category)}
            searchQuery={searchQuery}
          />
        ))}
      </ScrollArea>
      
      <div className="p-3 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground/70 text-center">
          Drag blocks to the canvas to build your network
        </p>
      </div>
    </div>
  );
}
