import { useCallback, useState } from "react";
import { Copy, Download, Check, Loader2, Code2, RefreshCw } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/components/theme-provider";

export default function CodePreview() {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const {
    nodes,
    generatedCode,
    codeNodeMapping,
    isGenerating,
    framework,
    provider,
    highlightedCodeLine,
    setGeneratedCode,
    setIsGenerating,
    setFramework,
    setProvider,
    highlightNode,
    serializeGraph,
  } = useCanvasStore();

  const handleGenerateCode = useCallback(async () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty Canvas",
        description: "Add some blocks to the canvas first",
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
        provider,
      });

      const data = await response.json();
      setGeneratedCode(data.code, data.nodeMapping || {});

      toast({
        title: "Code Generated",
        description: `Successfully generated ${framework.toUpperCase()} code`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [nodes, framework, provider, serializeGraph, setGeneratedCode, setIsGenerating, toast]);

  const handleCopy = useCallback(async () => {
    if (!generatedCode) return;

    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  }, [generatedCode, toast]);

  const handleExport = useCallback(async (format: "py" | "ipynb") => {
    if (!generatedCode) return;

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
        title: "Export Successful",
        description: `Downloaded neural_network.${format}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export code",
        variant: "destructive",
      });
    }
  }, [generatedCode, toast]);

  const handleLineHover = useCallback(
    (lineNumber: number) => {
      for (const [nodeId, range] of Object.entries(codeNodeMapping)) {
        if (lineNumber >= range.startLine && lineNumber <= range.endLine) {
          highlightNode(nodeId);
          return;
        }
      }
      highlightNode(null);
    },
    [codeNodeMapping, highlightNode]
  );

  const handleLineLeave = useCallback(() => {
    highlightNode(null);
  }, [highlightNode]);

  const prismTheme = theme === "dark" ? themes.nightOwl : themes.github;

  if (!generatedCode && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Code2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-sm font-medium text-muted-foreground">No Code Generated</h3>
        <p className="text-xs text-muted-foreground/70 mt-2 max-w-[200px] mb-6">
          Build your architecture on the canvas, then generate code
        </p>

        <div className="space-y-3 w-full max-w-[200px]">
          <Select
            value={framework}
            onValueChange={(value) => setFramework(value as "pytorch" | "tensorflow" | "jax")}
          >
            <SelectTrigger className="h-9" data-testid="select-framework">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pytorch">PyTorch</SelectItem>
              <SelectItem value="tensorflow">TensorFlow</SelectItem>
              <SelectItem value="jax">JAX</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={provider}
            onValueChange={(value) => setProvider(value as "gemini" | "openai" | "together" | "openrouter")}
          >
            <SelectTrigger className="h-9" data-testid="select-provider">
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Gemini (Default)</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="together">Together AI</SelectItem>
              <SelectItem value="openrouter">OpenRouter</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerateCode}
            disabled={nodes.length === 0}
            className="w-full"
            data-testid="button-generate-code"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Select
            value={framework}
            onValueChange={(value) => setFramework(value as "pytorch" | "tensorflow" | "jax")}
          >
            <SelectTrigger className="h-8 w-[120px] text-xs" data-testid="select-framework-header">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pytorch">PyTorch</SelectItem>
              <SelectItem value="tensorflow">TensorFlow</SelectItem>
              <SelectItem value="jax">JAX</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={provider}
            onValueChange={(value) => setProvider(value as "gemini" | "openai" | "together" | "openrouter")}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs" data-testid="select-provider-header">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="together">Together AI</SelectItem>
              <SelectItem value="openrouter">OpenRouter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateCode}
            disabled={isGenerating || nodes.length === 0}
            className="h-8 w-8"
            data-testid="button-regenerate"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!generatedCode}
            className="h-8 w-8"
            data-testid="button-copy-code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={!generatedCode}
                className="h-8 w-8"
                data-testid="button-export-dropdown"
              >
                <Download className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleExport("py")}
                data-testid="menu-export-py"
              >
                Download .py
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("ipynb")}
                data-testid="menu-export-ipynb"
              >
                Download .ipynb
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Generating code...</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <Highlight theme={prismTheme} code={generatedCode} language="python">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(className, "text-sm font-mono p-4")}
                style={{ ...style, background: "transparent" }}
              >
                {tokens.map((line, lineIndex) => {
                  const lineNumber = lineIndex + 1;
                  const isHighlighted = lineNumber === highlightedCodeLine;

                  return (
                    <div
                      key={lineIndex}
                      {...getLineProps({ line })}
                      className={cn(
                        "flex hover:bg-muted/30 transition-colors",
                        isHighlighted && "bg-chart-4/20"
                      )}
                      onMouseEnter={() => handleLineHover(lineNumber)}
                      onMouseLeave={handleLineLeave}
                    >
                      <span className="w-10 text-right pr-4 text-muted-foreground select-none text-xs">
                        {lineNumber}
                      </span>
                      <span className="flex-1">
                        {line.map((token, tokenIndex) => (
                          <span key={tokenIndex} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </ScrollArea>
      )}
    </div>
  );
}
