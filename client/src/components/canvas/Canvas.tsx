import { useCallback, useRef, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/lib/store";
import BlockNode from "./BlockNode";
import CustomEdge from "./CustomEdge";
import { cn } from "@/lib/utils";

const nodeTypes = {
  block: BlockNode,
};

const edgeTypes = {
  default: CustomEdge,
};

function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    selectEdge,
    saveSnapshot,
    deleteSelected,
    selectedNodeId,
    selectedEdgeId,
  } = useCanvasStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/neuro-canvas-block");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      saveSnapshot();
      addNode(type, position);
    },
    [screenToFlowPosition, addNode, saveSnapshot]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && 
          !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement)?.tagName)) {
        if (selectedNodeId || selectedEdgeId) {
          event.preventDefault();
          deleteSelected();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, deleteSelected]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full bg-background"
      data-testid="canvas-container"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => {
          saveSnapshot();
          onConnect(params);
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        className="bg-background"
        defaultEdgeOptions={{
          type: "default",
          style: { strokeWidth: 2 },
        }}
        connectionLineStyle={{
          strokeWidth: 2,
          stroke: "hsl(var(--primary))",
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={40}
          size={1.5}
          className="!bg-background"
          color="hsl(var(--muted-foreground) / 0.15)"
        />
        <Controls
          className={cn(
            "!bg-card/95 !backdrop-blur-sm !border-border !shadow-lg !rounded-xl",
            "[&_button]:!bg-card [&_button]:!border-border [&_button]:!fill-foreground [&_button]:!rounded-lg",
            "[&_button:hover]:!bg-accent [&_button:hover]:!fill-primary"
          )}
          data-testid="canvas-controls"
        />
        <MiniMap
          className="!bg-card/95 !backdrop-blur-sm !border-border !shadow-lg !rounded-xl"
          nodeColor={(node) => {
            const category = (node.data as { category?: string })?.category;
            switch (category) {
              case "layer":
                return "hsl(217, 91%, 60%)";
              case "activation":
                return "hsl(142, 76%, 36%)";
              case "operation":
                return "hsl(38, 92%, 50%)";
              case "attention":
                return "hsl(270, 91%, 60%)";
              default:
                return "hsl(var(--muted))";
            }
          }}
          maskColor="hsl(var(--background) / 0.85)"
          style={{ width: 160, height: 120 }}
          data-testid="canvas-minimap"
        />
      </ReactFlow>
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
