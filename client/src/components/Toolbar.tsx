import {
  Undo2,
  Redo2,
  Group,
  Trash2,
  Download,
  Save,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCanvasStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Toolbar() {
  const { toast } = useToast();
  const {
    nodes,
    selectedNodeId,
    undoStack,
    redoStack,
    generatedCode,
    undo,
    redo,
    deleteNode,
    clearCanvas,
    serializeGraph,
    setIsGenerating,
    setGeneratedCode,
    framework,
  } = useCanvasStore();

  const handleUndo = () => {
    if (undoStack.length > 0) {
      undo();
      toast({ title: "Undone", description: "Action undone" });
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      redo();
      toast({ title: "Redone", description: "Action redone" });
    }
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
      toast({ title: "Deleted", description: "Block removed" });
    }
  };

  const handleClear = () => {
    if (nodes.length > 0) {
      clearCanvas();
      toast({ title: "Cleared", description: "Canvas cleared" });
    }
  };

  const handleGenerateCode = async () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty Canvas",
        description: "Add some blocks first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const graph = serializeGraph();
      const response = await apiRequest("POST", "/api/generate-code", {
        graph,
        framework,
      });
      
      const data = await response.json();
      setGeneratedCode(data.code, data.nodeMapping || {});
      
      toast({
        title: "Code Generated",
        description: `${framework.toUpperCase()} code ready`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: "py" | "ipynb") => {
    if (!generatedCode) {
      toast({
        title: "No Code",
        description: "Generate code first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/export", {
        code: generatedCode,
        format,
        filename: "neural_network",
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neural_network.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Exported",
        description: `Downloaded .${format}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Neuro-Canvas</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              data-testid="button-undo"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              data-testid="button-redo"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={!selectedNodeId}
              data-testid="button-delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Selected</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={nodes.length === 0}
              data-testid="button-clear"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Canvas</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={handleGenerateCode}
              disabled={nodes.length === 0}
              className="px-4"
              data-testid="button-generate"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate Code</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!generatedCode}
              data-testid="button-export"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleExport("py")}
              data-testid="menu-export-py-toolbar"
            >
              Python Script (.py)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport("ipynb")}
              data-testid="menu-export-ipynb-toolbar"
            >
              Jupyter Notebook (.ipynb)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
