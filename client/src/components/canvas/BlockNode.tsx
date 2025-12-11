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
  Timer,
  Hash,
  Sparkles,
  Target,
  Shuffle,
  Database,
  Cpu,
  RotateCcw,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NodeData, BlockCategory, PortPosition } from "@shared/schema";
import { getBlockDefinition } from "@/lib/blocks";

const categoryIcons: Record<BlockCategory, typeof Box> = {
  layer: Layers,
  activation: Zap,
  operation: GitMerge,
  attention: Brain,
};

const categoryColors: Record<BlockCategory, { bg: string; border: string; accent: string; glow: string }> = {
  layer: {
    bg: "bg-gradient-to-br from-blue-500/15 to-blue-600/10 dark:from-blue-500/25 dark:to-blue-600/15",
    border: "border-blue-500/40 dark:border-blue-400/50",
    accent: "bg-gradient-to-r from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20",
  },
  activation: {
    bg: "bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 dark:from-emerald-500/25 dark:to-emerald-600/15",
    border: "border-emerald-500/40 dark:border-emerald-400/50",
    accent: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    glow: "shadow-emerald-500/20",
  },
  operation: {
    bg: "bg-gradient-to-br from-amber-500/15 to-amber-600/10 dark:from-amber-500/25 dark:to-amber-600/15",
    border: "border-amber-500/40 dark:border-amber-400/50",
    accent: "bg-gradient-to-r from-amber-500 to-amber-600",
    glow: "shadow-amber-500/20",
  },
  attention: {
    bg: "bg-gradient-to-br from-purple-500/15 to-purple-600/10 dark:from-purple-500/25 dark:to-purple-600/15",
    border: "border-purple-500/40 dark:border-purple-400/50",
    accent: "bg-gradient-to-r from-purple-500 to-purple-600",
    glow: "shadow-purple-500/20",
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
  swiglu: Sparkles,
  add: GitMerge,
  concat: GitMerge,
  flatten: Box,
  layernorm: Layers,
  batchnorm: Layers,
  rmsnorm: Gauge,
  dropout: Shuffle,
  multihead_attention: Brain,
  masked_multihead_attention: Brain,
  grouped_query_attention: Brain,
  sliding_window_attention: Brain,
  scaled_dot_product: Brain,
  embedding: Database,
  positional_encoding: Hash,
  position_wise_ffn: Cpu,
  add_norm: GitMerge,
  linear_projection: Target,
  rope: RotateCcw,
  patch_embedding: Grid3X3,
  cls_token: Target,
  mixture_of_experts: Shuffle,
  cross_entropy_loss: Activity,
  mse_loss: Activity,
  kl_divergence_loss: Activity,
};

const positionToReactFlowPosition: Record<PortPosition, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
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
      case "masked_multihead_attention":
        return `d=${params.embedDim}, h=${params.numHeads}`;
      case "grouped_query_attention":
        return `d=${params.embedDim}, h=${params.numHeads}, kv=${params.numKVGroups}`;
      case "dropout":
        return `p=${params.p}`;
      case "layernorm":
      case "rmsnorm":
        return `${params.normalizedShape || params.dim}`;
      case "batchnorm":
        return `${params.numFeatures}`;
      case "embedding":
        return `${params.numEmbeddings}×${params.embeddingDim}`;
      case "position_wise_ffn":
        return `${params.dModel}→${params.dFF}`;
      case "mixture_of_experts":
        return `${params.numExperts} experts, top-${params.topK}`;
      case "swiglu":
        return `${params.dModel}→${params.hiddenDim}`;
      default:
        return null;
    }
  }, [nodeData.blockType, nodeData.params]);

  const inputsByPosition = useMemo(() => {
    if (!definition) return { top: [], left: [], bottom: [], right: [] };
    return {
      top: definition.inputs.filter(i => i.position === "top"),
      left: definition.inputs.filter(i => !i.position || i.position === "left"),
      bottom: definition.inputs.filter(i => i.position === "bottom"),
      right: definition.inputs.filter(i => i.position === "right"),
    };
  }, [definition]);

  const outputsByPosition = useMemo(() => {
    if (!definition) return { top: [], left: [], bottom: [], right: [] };
    return {
      top: definition.outputs.filter(o => o.position === "top"),
      left: definition.outputs.filter(o => o.position === "left"),
      bottom: definition.outputs.filter(o => o.position === "bottom"),
      right: definition.outputs.filter(o => !o.position || o.position === "right"),
    };
  }, [definition]);

  const renderHandles = (
    ports: { id: string; type: string; label?: string; position?: PortPosition }[],
    handleType: "target" | "source",
    position: Position
  ) => {
    const isVertical = position === Position.Top || position === Position.Bottom;
    
    return ports.map((port, index) => {
      const offset = ports.length === 1 
        ? "50%" 
        : `${((index + 1) / (ports.length + 1)) * 100}%`;
      
      return (
        <Handle
          key={port.id}
          type={handleType}
          position={position}
          id={port.id}
          className={cn(
            "!w-2.5 !h-2.5 !bg-foreground/50 hover:!bg-primary hover:!w-3.5 hover:!h-3.5",
            "!border-2 !border-background !rounded-full transition-all duration-150",
            "hover:!shadow-lg hover:!shadow-primary/30"
          )}
          style={isVertical ? { left: offset } : { top: offset }}
          data-testid={`handle-${handleType}-${port.id}`}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        "relative px-4 py-3 min-w-[140px] max-w-[260px] transition-all duration-200",
        colors.bg,
        colors.border,
        "border backdrop-blur-sm",
        isActivation ? "rounded-2xl" : isOperation ? "rounded-xl" : "rounded-xl",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg",
        nodeData.isHighlighted && "ring-2 ring-chart-4 ring-offset-2 ring-offset-background",
        `shadow-md hover:shadow-xl ${colors.glow}`
      )}
      data-testid={`node-block-${nodeData.blockType}`}
    >
      {nodeData.category === "attention" && (
        <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-xl", colors.accent)} />
      )}
      
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          colors.accent,
          "flex items-center justify-center shadow-sm"
        )}>
          <BlockIcon className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold truncate text-foreground">{nodeData.label}</span>
          {paramSummary && (
            <span className="text-xs text-muted-foreground/80 truncate font-mono">{paramSummary}</span>
          )}
        </div>
      </div>
      
      {renderHandles(inputsByPosition.top, "target", Position.Top)}
      {renderHandles(inputsByPosition.left, "target", Position.Left)}
      {renderHandles(inputsByPosition.bottom, "target", Position.Bottom)}
      {renderHandles(inputsByPosition.right, "target", Position.Right)}
      
      {renderHandles(outputsByPosition.top, "source", Position.Top)}
      {renderHandles(outputsByPosition.left, "source", Position.Left)}
      {renderHandles(outputsByPosition.bottom, "source", Position.Bottom)}
      {renderHandles(outputsByPosition.right, "source", Position.Right)}
    </div>
  );
}

export default memo(BlockNode);
