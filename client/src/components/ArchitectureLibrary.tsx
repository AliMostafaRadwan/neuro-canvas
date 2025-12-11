import { useState, useMemo } from "react";
import { 
  Library, 
  Search, 
  Layers, 
  Brain, 
  Eye, 
  MessageSquare,
  Sparkles,
  X 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/store";
import { ARCHITECTURE_TEMPLATES, getTemplatesByCategory } from "@/lib/architectureTemplates";
import type { ArchitectureTemplate } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const categoryIcons: Record<string, typeof Layers> = {
  Transformer: Brain,
  Classic: Layers,
  Vision: Eye,
  RNN: MessageSquare,
  LLM: Sparkles,
};

const categoryColors: Record<string, string> = {
  Transformer: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  Classic: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Vision: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  RNN: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  LLM: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30",
};

interface TemplateCardProps {
  template: ArchitectureTemplate;
  onSelect: (template: ArchitectureTemplate) => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const CategoryIcon = categoryIcons[template.category] || Layers;
  const colorClass = categoryColors[template.category] || "bg-muted text-muted-foreground";

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl border bg-card/50 backdrop-blur-sm",
        "hover:bg-card hover:shadow-lg hover:border-primary/30",
        "transition-all duration-200 cursor-pointer"
      )}
      onClick={() => onSelect(template)}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2.5 rounded-lg border",
          colorClass
        )}>
          <CategoryIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{template.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {template.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {template.graph.nodes.length} blocks
            </Badge>
            <Badge variant="outline" className={cn("text-xs border", colorClass)}>
              {template.category}
            </Badge>
          </div>
        </div>
      </div>
      <div className={cn(
        "absolute inset-0 rounded-xl border-2 border-primary opacity-0",
        "group-hover:opacity-100 transition-opacity pointer-events-none"
      )} />
    </div>
  );
}

interface ArchitectureLibraryProps {
  trigger?: React.ReactNode;
}

export default function ArchitectureLibrary({ trigger }: ArchitectureLibraryProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { loadGraph, saveSnapshot, clearCanvas } = useCanvasStore();
  const { toast } = useToast();

  const templatesByCategory = useMemo(() => getTemplatesByCategory(), []);
  const categories = useMemo(() => Object.keys(templatesByCategory), [templatesByCategory]);

  const filteredTemplates = useMemo(() => {
    let templates = ARCHITECTURE_TEMPLATES;
    
    if (selectedCategory) {
      templates = templates.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        t => t.name.toLowerCase().includes(query) || 
             t.description.toLowerCase().includes(query) ||
             t.category.toLowerCase().includes(query)
      );
    }
    
    return templates;
  }, [selectedCategory, searchQuery]);

  const handleSelectTemplate = (template: ArchitectureTemplate) => {
    saveSnapshot();
    loadGraph(template.graph);
    setOpen(false);
    toast({
      title: "Template Loaded",
      description: `${template.name} has been loaded to the canvas`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Library className="w-4 h-4 mr-2" />
            Templates
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Library className="w-5 h-5 text-primary" />
            Architecture Templates
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant={selectedCategory === null ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="h-7 text-xs"
            >
              All
            </Button>
            {categories.map(category => {
              const Icon = categoryIcons[category] || Layers;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="h-7 text-xs"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category}
                </Button>
              );
            })}
          </div>
        </div>

        <ScrollArea className="flex-1 h-[50vh]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <Library className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No templates found matching your search.</p>
              </div>
            ) : (
              filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
