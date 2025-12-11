import { useRef } from "react";
import {
  Undo2,
  Redo2,
  Trash2,
  Download,
  Upload,
  LayoutGrid,
  Sparkles,
  FileJson,
  Library,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCanvasStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ArchitectureLibrary from "@/components/ArchitectureLibrary";
import type { SerializedGraph } from "@shared/schema";

export default function Toolbar() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    nodes,
    selectedNodeId,
    selectedEdgeId,
    undoStack,
    redoStack,
    generatedCode,
    undo,
    redo,
    deleteSelected,
    clearCanvas,
    serializeGraph,
    loadGraph,
    saveSnapshot,
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
    if (selectedNodeId || selectedEdgeId) {
      deleteSelected();
      toast({ 
        title: "Deleted", 
        description: selectedNodeId ? "Block removed" : "Connection removed" 
      });
    }
  };

  const handleClear = () => {
    if (nodes.length > 0) {
      clearCanvas();
      toast({ title: "Cleared", description: "Canvas cleared" });
    }
  };

  const handleSaveArchitecture = () => {
    const graph = serializeGraph();
    const dataStr = JSON.stringify(graph, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `architecture_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Saved",
      description: "Architecture saved to file",
    });
  };

  const handleImportArchitecture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const graph = JSON.parse(content) as SerializedGraph;
        
        if (!graph.nodes || !graph.edges) {
          throw new Error("Invalid architecture file");
        }
        
        saveSnapshot();
        loadGraph(graph);
        toast({
          title: "Imported",
          description: `Loaded ${graph.nodes.length} blocks`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid architecture file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
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
    <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card/95 backdrop-blur-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">Neuro-Canvas</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Neural Network Builder</span>
          </div>
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
              className="h-9 w-9"
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
              className="h-9 w-9"
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
              disabled={!selectedNodeId && !selectedEdgeId}
              className="h-9 w-9"
              data-testid="button-delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Selected (Del)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={nodes.length === 0}
              className="h-9 w-9"
              data-testid="button-clear"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Canvas</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <ArchitectureLibrary
          trigger={
            <Button variant="outline" size="sm" className="h-9 px-3">
              <Library className="w-4 h-4 mr-2" />
              Templates
            </Button>
          }
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3">
              <FileJson className="w-4 h-4 mr-2" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={handleSaveArchitecture} disabled={nodes.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Save Architecture
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportArchitecture}>
              <Upload className="w-4 h-4 mr-2" />
              Import Architecture
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={handleGenerateCode}
              disabled={nodes.length === 0}
              className="h-9 px-4 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
              data-testid="button-generate"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Code
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate Neural Network Code</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!generatedCode}
              className="h-9"
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
