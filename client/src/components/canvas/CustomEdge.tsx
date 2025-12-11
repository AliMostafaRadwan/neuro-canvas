import { memo, useState } from "react";
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from "@xyflow/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/store";

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { deleteEdge, saveSnapshot, selectedEdgeId, selectEdge } = useCanvasStore();
  const isSelected = selectedEdgeId === id;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveSnapshot();
    deleteEdge(id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectEdge(id);
  };

  const isValid = data?.isValid !== false;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isSelected || isHovered ? 3 : 2,
          stroke: !isValid ? "#ef4444" : isSelected ? "hsl(var(--primary))" : isHovered ? "hsl(var(--primary) / 0.7)" : "hsl(var(--muted-foreground) / 0.4)",
          transition: "stroke 0.15s, stroke-width 0.15s",
        }}
        interactionWidth={20}
      />
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      />
      <EdgeLabelRenderer>
        {(isHovered || isSelected) && (
          <button
            onClick={handleDelete}
            className={cn(
              "absolute flex items-center justify-center",
              "w-5 h-5 rounded-full",
              "bg-destructive text-destructive-foreground",
              "hover:scale-110 transition-transform",
              "shadow-md cursor-pointer",
              "pointer-events-auto"
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CustomEdge);
