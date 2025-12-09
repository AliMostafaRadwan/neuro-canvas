import { memo, useMemo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { 
  Box, 
  Zap, 
  GitMerge, 
  Brain,
  Layers,
  Activity,
  Grid3X3,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NodeData, BlockCategory } from "@shared/schema";
import { getBlockDefinition } from "@/lib/blocks";

const categoryIcons: Record<BlockCategory, typeof Box> = {
  layer: Layers,
  activation: Zap,
  operation: GitMerge,
  attention: Brain,
};

const categoryColors: Record<BlockCategory, { bg: string; border: string; accent: string }> = {
  layer: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    border: "border-blue-500/30 dark:border-blue-500/40",
    accent: "bg-blue-500",
  },
  activation: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    border: "border-emerald-500/30 dark:border-emerald-500/40",
    accent: "bg-emerald-500",
  },
  operation: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    border: "border-amber-500/30 dark:border-amber-500/40",
    accent: "bg-amber-500",
  },
  attention: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    border: "border-purple-500/30 dark:border-purple-500/40",
    accent: "bg-purple-500",
  },
};

const blockTypeIcons: Record<string, typeof Box> = {
  linear: Layers,
  conv2d: Grid3X3,
  lstm: Timer,
  gru: Timer,
  relu: Zap,
  gelu: Zap,
  softmax: Activity,
  sigmoid: Activity,
  add: GitMerge,
  concat: GitMerge,
  flatten: Box,
  layernorm: Layers,
  batchnorm: Layers,
  dropout: Box,
  multihead_attention: Brain,
  scaled_dot_product: Brain,
};

function BlockNode({ data, selected }: NodeProps) {
  const nodeData = data as NodeData;
  const definition = getBlockDefinition(nodeData.blockType);
  const colors = categoryColors[nodeData.category];
  const CategoryIcon = categoryIcons[nodeData.category];
  const BlockIcon = blockTypeIcons[nodeData.blockType] || CategoryIcon;
  
  const isActivation = nodeData.category === "activation";
  const isOperation = nodeData.category === "operation";
  
  const paramSummary = useMemo(() => {
    const params = nodeData.params;
    if (!params || Object.keys(params).length === 0) return null;
    
    switch (nodeData.blockType) {
      case "linear":
        return `${params.inFeatures} → ${params.outFeatures}`;
      case "conv2d":
        return `${params.inChannels}→${params.outChannels}, k${params.kernelSize}`;
      case "lstm":
      case "gru":
        return `${params.inputSize} → ${params.hiddenSize}`;
      case "multihead_attention":
        return `d=${params.embedDim}, h=${params.numHeads}`;
      case "dropout":
        return `p=${params.p}`;
      case "layernorm":
        return `${params.normalizedShape}`;
      case "batchnorm":
        return `${params.numFeatures}`;
      default:
        return null;
    }
  }, [nodeData.blockType, nodeData.params]);

  return (
    <div
      className={cn(
        "relative px-3 py-2 min-w-[120px] max-w-[240px] transition-all duration-150",
        colors.bg,
        colors.border,
        "border",
        isActivation ? "rounded-full" : isOperation ? "rounded-lg" : "rounded-lg",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        nodeData.isHighlighted && "ring-2 ring-chart-4 ring-offset-2 ring-offset-background",
        "shadow-sm hover:shadow-md"
      )}
      data-testid={`node-block-${nodeData.blockType}`}
    >
      {nodeData.category === "attention" && (
        <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-lg", colors.accent)} />
      )}
      
      <div className="flex items-center gap-2">
        <div className={cn("p-1 rounded", colors.accent, "bg-opacity-20")}>
          <BlockIcon className="w-4 h-4 text-foreground" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">{nodeData.label}</span>
          {paramSummary && (
            <span className="text-xs text-muted-foreground truncate">{paramSummary}</span>
          )}
        </div>
      </div>
      
      {definition?.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className={cn(
            "!w-2 !h-2 !bg-foreground/60 hover:!bg-foreground hover:!w-3 hover:!h-3",
            "!border-2 !border-background transition-all duration-150"
          )}
          style={{
            top: definition.inputs.length === 1 
              ? "50%" 
              : `${((index + 1) / (definition.inputs.length + 1)) * 100}%`,
          }}
          data-testid={`handle-input-${input.id}`}
        />
      ))}
      
      {definition?.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className={cn(
            "!w-2 !h-2 !bg-foreground/60 hover:!bg-foreground hover:!w-3 hover:!h-3",
            "!border-2 !border-background transition-all duration-150"
          )}
          style={{
            top: definition.outputs.length === 1
              ? "50%"
              : `${((index + 1) / (definition.outputs.length + 1)) * 100}%`,
          }}
          data-testid={`handle-output-${output.id}`}
        />
      ))}
    </div>
  );
}

export default memo(BlockNode);
