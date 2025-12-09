import { useMemo } from "react";
import { Settings, Trash2, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/store";
import { getBlockDefinition } from "@/lib/blocks";
import type { BlockCategory } from "@shared/schema";

const categoryLabels: Record<BlockCategory, string> = {
  layer: "Layer",
  activation: "Activation",
  operation: "Operation",
  attention: "Attention",
};

const categoryColors: Record<BlockCategory, string> = {
  layer: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  activation: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  operation: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  attention: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
};

interface ParamFieldProps {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  schema?: { type?: string; minimum?: number; maximum?: number };
}

function ParamField({ name, value, onChange, schema }: ParamFieldProps) {
  const label = name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  const valueType = typeof value;

  if (valueType === "boolean") {
    return (
      <div className="flex items-center justify-between py-2">
        <Label htmlFor={name} className="text-xs font-medium">
          {label}
        </Label>
        <Switch
          id={name}
          checked={value as boolean}
          onCheckedChange={onChange}
          data-testid={`switch-param-${name}`}
        />
      </div>
    );
  }

  if (valueType === "number") {
    return (
      <div className="space-y-2 py-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={name} className="text-xs font-medium">
            {label}
          </Label>
          {schema?.minimum !== undefined && schema?.maximum !== undefined && (
            <span className="text-xs text-muted-foreground">
              {schema.minimum} - {schema.maximum}
            </span>
          )}
        </div>
        <Input
          id={name}
          type="number"
          value={value as number}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
              let clampedValue = num;
              if (schema?.minimum !== undefined) {
                clampedValue = Math.max(schema.minimum, clampedValue);
              }
              if (schema?.maximum !== undefined) {
                clampedValue = Math.min(schema.maximum, clampedValue);
              }
              onChange(clampedValue);
            }
          }}
          min={schema?.minimum}
          max={schema?.maximum}
          step={(value as number).toString().includes(".") ? 0.01 : 1}
          className="h-9"
          data-testid={`input-param-${name}`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2 py-2">
      <Label htmlFor={name} className="text-xs font-medium">
        {label}
      </Label>
      <Input
        id={name}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="h-9"
        data-testid={`input-param-${name}`}
      />
    </div>
  );
}

export default function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNodeParams, deleteNode, selectNode } = useCanvasStore();

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  const definition = useMemo(() => {
    if (!selectedNode) return null;
    return getBlockDefinition(selectedNode.data.blockType);
  }, [selectedNode]);

  if (!selectedNode || !definition) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Settings className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-sm font-medium text-muted-foreground">No Block Selected</h3>
        <p className="text-xs text-muted-foreground/70 mt-2 max-w-[200px]">
          Select a block on the canvas to view and edit its properties
        </p>
      </div>
    );
  }

  const handleParamChange = (name: string, value: unknown) => {
    updateNodeParams(selectedNode.id, { [name]: value });
  };

  const handleDelete = () => {
    deleteNode(selectedNode.id);
  };

  const handleClose = () => {
    selectNode(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold truncate">{selectedNode.data.label}</h2>
          <Badge
            variant="secondary"
            className={cn("text-xs shrink-0", categoryColors[selectedNode.data.category])}
          >
            {categoryLabels[selectedNode.data.category]}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          data-testid="button-close-properties"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{definition.description}</p>
          </div>

          <Separator className="my-4" />

          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Parameters
          </h3>

          {Object.entries(selectedNode.data.params).map(([key, value]) => (
            <ParamField
              key={key}
              name={key}
              value={value}
              onChange={(newValue) => handleParamChange(key, newValue)}
            />
          ))}

          {Object.keys(selectedNode.data.params).length === 0 && (
            <p className="text-xs text-muted-foreground py-4 text-center">
              This block has no configurable parameters
            </p>
          )}

          <Separator className="my-4" />

          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Connections
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Inputs:</span>
              <span className="font-medium">{definition.inputs.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Outputs:</span>
              <span className="font-medium">{definition.outputs.length}</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="w-full"
              data-testid="button-delete-node"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Block
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove this block from the canvas</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
