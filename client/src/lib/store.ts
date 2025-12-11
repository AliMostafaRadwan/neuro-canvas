import { create } from "zustand";
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import type { NodeData, EdgeData, SerializedGraph, SuperBlock } from "@shared/schema";
import { getBlockDefinition } from "./blocks";

interface CanvasState {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  highlightedNodeId: string | null;
  highlightedCodeLine: number | null;
  generatedCode: string;
  codeNodeMapping: Record<string, { startLine: number; endLine: number }>;
  isGenerating: boolean;
  superBlocks: SuperBlock[];
  undoStack: SerializedGraph[];
  redoStack: SerializedGraph[];
  framework: "pytorch" | "tensorflow" | "jax";
  provider: "gemini" | "openai" | "together" | "openrouter" | "mistral";

  // Actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge<EdgeData>[]) => void;
  onNodesChange: (changes: NodeChange<Node<NodeData>>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge<EdgeData>>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position: { x: number; y: number }) => string;
  updateNodeParams: (nodeId: string, params: Record<string, unknown>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  highlightNode: (nodeId: string | null) => void;
  setHighlightedCodeLine: (line: number | null) => void;
  setGeneratedCode: (code: string, mapping: Record<string, { startLine: number; endLine: number }>) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setFramework: (framework: "pytorch" | "tensorflow" | "jax") => void;
  setProvider: (provider: "gemini" | "openai" | "together" | "openrouter" | "mistral") => void;
  serializeGraph: () => SerializedGraph;
  loadGraph: (graph: SerializedGraph) => void;
  createSuperBlock: (nodeIds: string[], name: string) => void;
  ungroupSuperBlock: (superBlockId: string) => void;
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  deleteSelected: () => void;
}

let nodeIdCounter = 0;

function generateNodeId(existingIds: Set<string>): string {
  let id: string;
  do {
    id = `node_${++nodeIdCounter}`;
  } while (existingIds.has(id));
  return id;
}

function validateConnection(
  sourceNode: Node<NodeData> | undefined,
  targetNode: Node<NodeData> | undefined,
  sourceHandle: string | null,
  targetHandle: string | null
): { valid: boolean; message?: string } {
  if (!sourceNode || !targetNode) {
    return { valid: false, message: "Invalid nodes" };
  }

  const sourceDef = getBlockDefinition(sourceNode.data.blockType);
  const targetDef = getBlockDefinition(targetNode.data.blockType);

  if (!sourceDef || !targetDef) {
    return { valid: false, message: "Unknown block type" };
  }

  const sourcePort = sourceDef.outputs.find(p => p.id === sourceHandle);
  const targetPort = targetDef.inputs.find(p => p.id === targetHandle);

  if (!sourcePort || !targetPort) {
    return { valid: false, message: "Invalid port" };
  }

  if (sourcePort.type !== targetPort.type && sourcePort.type !== "any" && targetPort.type !== "any") {
    return { valid: false, message: `Type mismatch: ${sourcePort.type} → ${targetPort.type}` };
  }

  return { valid: true };
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  highlightedNodeId: null,
  highlightedCodeLine: null,
  generatedCode: "",
  codeNodeMapping: {},
  isGenerating: false,
  superBlocks: [],
  undoStack: [],
  redoStack: [],
  framework: "pytorch",
  provider: "gemini",

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const { nodes, edges } = get();
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    const validation = validateConnection(
      sourceNode,
      targetNode,
      connection.sourceHandle,
      connection.targetHandle
    );

    const newEdge: Edge<EdgeData> = {
      ...connection,
      id: `edge_${connection.source}_${connection.target}_${Date.now()}`,
      data: {
        isValid: validation.valid,
        errorMessage: validation.message,
      },
      style: validation.valid ? undefined : { stroke: "#ef4444" },
      animated: validation.valid,
    } as Edge<EdgeData>;

    set({ edges: addEdge(newEdge, edges) });
  },

  addNode: (type, position) => {
    const definition = getBlockDefinition(type);
    if (!definition) return "";

    const existingIds = new Set(get().nodes.map(n => n.id));
    const id = generateNodeId(existingIds);
    const newNode: Node<NodeData> = {
      id,
      type: "block",
      position,
      data: {
        blockType: type,
        label: definition.label,
        category: definition.category,
        params: { ...definition.defaultParams },
      },
    };

    set({ nodes: [...get().nodes, newNode] });
    return id;
  },

  updateNodeParams: (nodeId, params) => {
    set({
      nodes: get().nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, params: { ...node.data.params, ...params } } }
          : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter(n => n.id !== nodeId),
      edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter(e => e.id !== edgeId),
      selectedEdgeId: get().selectedEdgeId === edgeId ? null : get().selectedEdgeId,
    });
  },

  selectNode: (nodeId) => {
    set({
      selectedNodeId: nodeId,
      selectedEdgeId: null,
      nodes: get().nodes.map(node => ({
        ...node,
        data: { ...node.data, isSelected: node.id === nodeId },
      })),
    });
  },

  selectEdge: (edgeId) => {
    set({
      selectedEdgeId: edgeId,
      selectedNodeId: null,
      nodes: get().nodes.map(node => ({
        ...node,
        data: { ...node.data, isSelected: false },
      })),
    });
  },

  highlightNode: (nodeId) => {
    set({
      highlightedNodeId: nodeId,
      nodes: get().nodes.map(node => ({
        ...node,
        data: { ...node.data, isHighlighted: node.id === nodeId },
      })),
    });
  },

  setHighlightedCodeLine: (line) => set({ highlightedCodeLine: line }),

  setGeneratedCode: (code, mapping) => set({ generatedCode: code, codeNodeMapping: mapping }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setFramework: (framework) => set({ framework }),

  setProvider: (provider) => set({ provider }),

  serializeGraph: () => {
    const { nodes, edges, framework } = get();
    return {
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.data.blockType,
        label: n.data.label,
        params: n.data.params,
        position: n.position,
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle || "",
        target: e.target,
        targetHandle: e.targetHandle || "",
      })),
      metadata: { framework },
    };
  },

  loadGraph: (graph) => {
    const nodeIds = new Set(graph.nodes.map(n => n.id));

    const nodes: Node<NodeData>[] = graph.nodes.map(n => {
      const definition = getBlockDefinition(n.type);
      return {
        id: n.id,
        type: "block",
        position: n.position,
        data: {
          blockType: n.type,
          label: n.label,
          category: definition?.category || "layer",
          params: n.params,
        },
      };
    });

    const validEdges: Edge<EdgeData>[] = graph.edges
      .filter(e => {
        if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
          console.warn(`Skipping edge ${e.id}: references non-existent node`);
          return false;
        }
        const sourceNode = graph.nodes.find(n => n.id === e.source);
        const targetNode = graph.nodes.find(n => n.id === e.target);
        if (!sourceNode || !targetNode) return false;

        const sourceDef = getBlockDefinition(sourceNode.type);
        const targetDef = getBlockDefinition(targetNode.type);

        const hasSourceHandle = !e.sourceHandle || sourceDef?.outputs.some(o => o.id === e.sourceHandle);
        const hasTargetHandle = !e.targetHandle || targetDef?.inputs.some(i => i.id === e.targetHandle);

        if (!hasSourceHandle || !hasTargetHandle) {
          console.warn(`Skipping edge ${e.id}: invalid handle reference`);
          return false;
        }
        return true;
      })
      .map(e => ({
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle,
        target: e.target,
        targetHandle: e.targetHandle,
        data: { isValid: true },
        animated: true,
      }));

    const maxId = Math.max(0, ...graph.nodes.map(n => {
      const match = n.id.match(/node_(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }));
    nodeIdCounter = maxId;

    set({ nodes, edges: validEdges, selectedNodeId: null, selectedEdgeId: null });
  },

  createSuperBlock: (nodeIds, name) => {
    const { nodes, superBlocks } = get();
    const selectedNodes = nodes.filter(n => nodeIds.includes(n.id));

    if (selectedNodes.length < 2) return;

    const minX = Math.min(...selectedNodes.map(n => n.position.x));
    const minY = Math.min(...selectedNodes.map(n => n.position.y));

    const superBlock: SuperBlock = {
      id: `superblock_${Date.now()}`,
      name,
      nodeIds,
      position: { x: minX - 20, y: minY - 40 },
      isCollapsed: false,
    };

    set({ superBlocks: [...superBlocks, superBlock] });
  },

  ungroupSuperBlock: (superBlockId) => {
    set({
      superBlocks: get().superBlocks.filter(sb => sb.id !== superBlockId),
    });
  },

  saveSnapshot: () => {
    const graph = get().serializeGraph();
    set({
      undoStack: [...get().undoStack, graph],
      redoStack: [],
    });
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return;

    const currentGraph = get().serializeGraph();
    const previousGraph = undoStack[undoStack.length - 1];

    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, currentGraph],
    });

    get().loadGraph(previousGraph);
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return;

    const currentGraph = get().serializeGraph();
    const nextGraph = redoStack[redoStack.length - 1];

    set({
      undoStack: [...undoStack, currentGraph],
      redoStack: redoStack.slice(0, -1),
    });

    get().loadGraph(nextGraph);
  },

  clearCanvas: () => {
    get().saveSnapshot();
    set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null, generatedCode: "", codeNodeMapping: {} });
  },

  deleteSelected: () => {
    const { selectedNodeId, selectedEdgeId, deleteNode, deleteEdge, saveSnapshot } = get();
    if (selectedNodeId) {
      saveSnapshot();
      deleteNode(selectedNodeId);
    } else if (selectedEdgeId) {
      saveSnapshot();
      deleteEdge(selectedEdgeId);
    }
  },
}));
