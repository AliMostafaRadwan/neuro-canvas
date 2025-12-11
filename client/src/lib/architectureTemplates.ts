import type { SerializedGraph, ArchitectureTemplate } from "@shared/schema";

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: "transformer-encoder",
    name: "Transformer Encoder",
    description: "Classic transformer encoder block with self-attention and feed-forward layers",
    category: "Transformer",
    graph: {
      nodes: [
        { id: "node_1", type: "embedding", label: "Embedding", params: { numEmbeddings: 50257, embeddingDim: 512 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "positional_encoding", label: "Positional Encoding", params: { maxLen: 512, embeddingDim: 512, dropout: 0.1 }, position: { x: 250, y: 150 } },
        { id: "node_3", type: "multihead_attention", label: "Multi-Head Attention", params: { embedDim: 512, numHeads: 8, dropout: 0.1 }, position: { x: 250, y: 280 } },
        { id: "node_4", type: "add_norm", label: "Add & Norm", params: { normalizedShape: 512 }, position: { x: 250, y: 400 } },
        { id: "node_5", type: "position_wise_ffn", label: "Feed Forward", params: { dModel: 512, dFF: 2048, dropout: 0.1 }, position: { x: 250, y: 500 } },
        { id: "node_6", type: "add_norm", label: "Add & Norm", params: { normalizedShape: 512 }, position: { x: 250, y: 600 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "in" },
        { id: "edge_2", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "query" },
        { id: "edge_3", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "key" },
        { id: "edge_4", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "value" },
        { id: "edge_5", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "sublayer" },
        { id: "edge_6", source: "node_2", sourceHandle: "out", target: "node_4", targetHandle: "x" },
        { id: "edge_7", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "in" },
        { id: "edge_8", source: "node_5", sourceHandle: "out", target: "node_6", targetHandle: "sublayer" },
        { id: "edge_9", source: "node_4", sourceHandle: "out", target: "node_6", targetHandle: "x" },
      ],
      metadata: { name: "Transformer Encoder", framework: "pytorch" },
    },
  },
  {
    id: "transformer-decoder",
    name: "Transformer Decoder",
    description: "Transformer decoder with masked self-attention and cross-attention",
    category: "Transformer",
    graph: {
      nodes: [
        { id: "node_1", type: "embedding", label: "Output Embedding", params: { numEmbeddings: 50257, embeddingDim: 512 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "positional_encoding", label: "Positional Encoding", params: { maxLen: 512, embeddingDim: 512 }, position: { x: 250, y: 150 } },
        { id: "node_3", type: "masked_multihead_attention", label: "Masked Multi-Head Attention", params: { embedDim: 512, numHeads: 8 }, position: { x: 250, y: 280 } },
        { id: "node_4", type: "add_norm", label: "Add & Norm", params: { normalizedShape: 512 }, position: { x: 250, y: 400 } },
        { id: "node_5", type: "position_wise_ffn", label: "Feed Forward", params: { dModel: 512, dFF: 2048 }, position: { x: 250, y: 500 } },
        { id: "node_6", type: "add_norm", label: "Add & Norm", params: { normalizedShape: 512 }, position: { x: 250, y: 600 } },
        { id: "node_7", type: "linear_projection", label: "Linear Projection", params: { inFeatures: 512, vocabSize: 50257 }, position: { x: 250, y: 700 } },
        { id: "node_8", type: "softmax", label: "Softmax", params: { dim: -1 }, position: { x: 250, y: 800 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "in" },
        { id: "edge_2", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "query" },
        { id: "edge_3", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "key" },
        { id: "edge_4", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "value" },
        { id: "edge_5", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "sublayer" },
        { id: "edge_6", source: "node_2", sourceHandle: "out", target: "node_4", targetHandle: "x" },
        { id: "edge_7", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "in" },
        { id: "edge_8", source: "node_5", sourceHandle: "out", target: "node_6", targetHandle: "sublayer" },
        { id: "edge_9", source: "node_4", sourceHandle: "out", target: "node_6", targetHandle: "x" },
        { id: "edge_10", source: "node_6", sourceHandle: "out", target: "node_7", targetHandle: "in" },
        { id: "edge_11", source: "node_7", sourceHandle: "logits", target: "node_8", targetHandle: "in" },
      ],
      metadata: { name: "Transformer Decoder", framework: "pytorch" },
    },
  },
  {
    id: "simple-mlp",
    name: "Simple MLP",
    description: "Basic multi-layer perceptron with ReLU activations",
    category: "Classic",
    graph: {
      nodes: [
        { id: "node_1", type: "linear", label: "Linear 1", params: { inFeatures: 784, outFeatures: 256 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "relu", label: "ReLU", params: {}, position: { x: 250, y: 150 } },
        { id: "node_3", type: "dropout", label: "Dropout", params: { p: 0.2 }, position: { x: 250, y: 250 } },
        { id: "node_4", type: "linear", label: "Linear 2", params: { inFeatures: 256, outFeatures: 128 }, position: { x: 250, y: 350 } },
        { id: "node_5", type: "relu", label: "ReLU", params: {}, position: { x: 250, y: 450 } },
        { id: "node_6", type: "linear", label: "Output", params: { inFeatures: 128, outFeatures: 10 }, position: { x: 250, y: 550 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "in" },
        { id: "edge_2", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "in" },
        { id: "edge_3", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "in" },
        { id: "edge_4", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "in" },
        { id: "edge_5", source: "node_5", sourceHandle: "out", target: "node_6", targetHandle: "in" },
      ],
      metadata: { name: "Simple MLP", framework: "pytorch" },
    },
  },
  {
    id: "cnn-classifier",
    name: "CNN Image Classifier",
    description: "Convolutional neural network for image classification",
    category: "Vision",
    graph: {
      nodes: [
        { id: "node_1", type: "conv2d", label: "Conv2D 1", params: { inChannels: 3, outChannels: 32, kernelSize: 3 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "relu", label: "ReLU", params: {}, position: { x: 250, y: 150 } },
        { id: "node_3", type: "conv2d", label: "Conv2D 2", params: { inChannels: 32, outChannels: 64, kernelSize: 3 }, position: { x: 250, y: 250 } },
        { id: "node_4", type: "relu", label: "ReLU", params: {}, position: { x: 250, y: 350 } },
        { id: "node_5", type: "flatten", label: "Flatten", params: { startDim: 1 }, position: { x: 250, y: 450 } },
        { id: "node_6", type: "linear", label: "FC 1", params: { inFeatures: 64, outFeatures: 128 }, position: { x: 250, y: 550 } },
        { id: "node_7", type: "relu", label: "ReLU", params: {}, position: { x: 250, y: 650 } },
        { id: "node_8", type: "linear", label: "Output", params: { inFeatures: 128, outFeatures: 10 }, position: { x: 250, y: 750 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "in" },
        { id: "edge_2", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "in" },
        { id: "edge_3", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "in" },
        { id: "edge_4", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "in" },
        { id: "edge_5", source: "node_5", sourceHandle: "out", target: "node_6", targetHandle: "in" },
        { id: "edge_6", source: "node_6", sourceHandle: "out", target: "node_7", targetHandle: "in" },
        { id: "edge_7", source: "node_7", sourceHandle: "out", target: "node_8", targetHandle: "in" },
      ],
      metadata: { name: "CNN Classifier", framework: "pytorch" },
    },
  },
  {
    id: "vision-transformer",
    name: "Vision Transformer (ViT)",
    description: "Vision Transformer architecture for image classification",
    category: "Vision",
    graph: {
      nodes: [
        { id: "node_1", type: "patch_embedding", label: "Patch Embedding", params: { patchSize: 16, inChannels: 3, embedDim: 768 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "cls_token", label: "CLS Token", params: { embedDim: 768 }, position: { x: 250, y: 150 } },
        { id: "node_3", type: "positional_encoding", label: "Positional Encoding", params: { maxLen: 197, embeddingDim: 768 }, position: { x: 250, y: 250 } },
        { id: "node_4", type: "layernorm", label: "LayerNorm", params: { normalizedShape: 768 }, position: { x: 250, y: 350 } },
        { id: "node_5", type: "multihead_attention", label: "Multi-Head Attention", params: { embedDim: 768, numHeads: 12 }, position: { x: 250, y: 450 } },
        { id: "node_6", type: "add", label: "Add", params: {}, position: { x: 250, y: 550 } },
        { id: "node_7", type: "layernorm", label: "LayerNorm", params: { normalizedShape: 768 }, position: { x: 250, y: 650 } },
        { id: "node_8", type: "position_wise_ffn", label: "MLP", params: { dModel: 768, dFF: 3072 }, position: { x: 250, y: 750 } },
        { id: "node_9", type: "linear", label: "Classification Head", params: { inFeatures: 768, outFeatures: 1000 }, position: { x: 250, y: 850 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "patches", target: "node_2", targetHandle: "in" },
        { id: "edge_2", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "in" },
        { id: "edge_3", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "in" },
        { id: "edge_4", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "query" },
        { id: "edge_5", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "key" },
        { id: "edge_6", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "value" },
        { id: "edge_7", source: "node_5", sourceHandle: "out", target: "node_6", targetHandle: "a" },
        { id: "edge_8", source: "node_3", sourceHandle: "out", target: "node_6", targetHandle: "b" },
        { id: "edge_9", source: "node_6", sourceHandle: "out", target: "node_7", targetHandle: "in" },
        { id: "edge_10", source: "node_7", sourceHandle: "out", target: "node_8", targetHandle: "in" },
        { id: "edge_11", source: "node_8", sourceHandle: "out", target: "node_9", targetHandle: "in" },
      ],
      metadata: { name: "Vision Transformer", framework: "pytorch" },
    },
  },
  {
    id: "lstm-sequence",
    name: "LSTM Sequence Model",
    description: "LSTM-based sequence processing with linear output",
    category: "RNN",
    graph: {
      nodes: [
        { id: "node_1", type: "embedding", label: "Embedding", params: { numEmbeddings: 10000, embeddingDim: 256 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "lstm", label: "LSTM", params: { inputSize: 256, hiddenSize: 512, numLayers: 2, bidirectional: true }, position: { x: 250, y: 180 } },
        { id: "node_3", type: "dropout", label: "Dropout", params: { p: 0.3 }, position: { x: 250, y: 310 } },
        { id: "node_4", type: "linear", label: "Output", params: { inFeatures: 1024, outFeatures: 10000 }, position: { x: 250, y: 410 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "in" },
        { id: "edge_2", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "in" },
        { id: "edge_3", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "in" },
      ],
      metadata: { name: "LSTM Sequence", framework: "pytorch" },
    },
  },
  {
    id: "resnet-block",
    name: "ResNet Block",
    description: "Residual connection block with skip connection",
    category: "Classic",
    graph: {
      nodes: [
        { id: "node_1", type: "conv2d", label: "Conv2D 1", params: { inChannels: 64, outChannels: 64, kernelSize: 3, padding: 1 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "batchnorm", label: "BatchNorm", params: { numFeatures: 64 }, position: { x: 250, y: 150 } },
        { id: "node_3", type: "relu", label: "ReLU", params: {}, position: { x: 250, y: 250 } },
        { id: "node_4", type: "conv2d", label: "Conv2D 2", params: { inChannels: 64, outChannels: 64, kernelSize: 3, padding: 1 }, position: { x: 250, y: 350 } },
        { id: "node_5", type: "batchnorm", label: "BatchNorm", params: { numFeatures: 64 }, position: { x: 250, y: 450 } },
        { id: "node_6", type: "add", label: "Residual Add", params: {}, position: { x: 250, y: 550 } },
        { id: "node_7", type: "relu", label: "ReLU", params: {}, position: { x: 250, y: 650 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "in" },
        { id: "edge_2", source: "node_2", sourceHandle: "out", target: "node_3", targetHandle: "in" },
        { id: "edge_3", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "in" },
        { id: "edge_4", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "in" },
        { id: "edge_5", source: "node_5", sourceHandle: "out", target: "node_6", targetHandle: "a" },
        { id: "edge_6", source: "node_1", sourceHandle: "out", target: "node_6", targetHandle: "b" },
        { id: "edge_7", source: "node_6", sourceHandle: "out", target: "node_7", targetHandle: "in" },
      ],
      metadata: { name: "ResNet Block", framework: "pytorch" },
    },
  },
  {
    id: "llama-block",
    name: "LLaMA Block",
    description: "Modern LLM architecture block with RMSNorm, RoPE, and SwiGLU",
    category: "LLM",
    graph: {
      nodes: [
        { id: "node_1", type: "rmsnorm", label: "RMSNorm", params: { dim: 512 }, position: { x: 250, y: 50 } },
        { id: "node_2", type: "rope", label: "RoPE", params: { dim: 64, maxSeqLen: 2048 }, position: { x: 250, y: 150 } },
        { id: "node_3", type: "grouped_query_attention", label: "GQA", params: { embedDim: 512, numHeads: 32, numKVGroups: 8 }, position: { x: 250, y: 280 } },
        { id: "node_4", type: "add", label: "Residual", params: {}, position: { x: 250, y: 400 } },
        { id: "node_5", type: "rmsnorm", label: "RMSNorm", params: { dim: 512 }, position: { x: 250, y: 500 } },
        { id: "node_6", type: "swiglu", label: "SwiGLU", params: { dModel: 512, hiddenDim: 2048 }, position: { x: 250, y: 600 } },
        { id: "node_7", type: "add", label: "Residual", params: {}, position: { x: 250, y: 700 } },
      ],
      edges: [
        { id: "edge_1", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "query" },
        { id: "edge_2", source: "node_1", sourceHandle: "out", target: "node_2", targetHandle: "key" },
        { id: "edge_3", source: "node_2", sourceHandle: "query_out", target: "node_3", targetHandle: "query" },
        { id: "edge_4", source: "node_2", sourceHandle: "key_out", target: "node_3", targetHandle: "key" },
        { id: "edge_5", source: "node_1", sourceHandle: "out", target: "node_3", targetHandle: "value" },
        { id: "edge_6", source: "node_3", sourceHandle: "out", target: "node_4", targetHandle: "a" },
        { id: "edge_7", source: "node_4", sourceHandle: "out", target: "node_5", targetHandle: "in" },
        { id: "edge_8", source: "node_5", sourceHandle: "out", target: "node_6", targetHandle: "in" },
        { id: "edge_9", source: "node_6", sourceHandle: "out", target: "node_7", targetHandle: "a" },
        { id: "edge_10", source: "node_4", sourceHandle: "out", target: "node_7", targetHandle: "b" },
      ],
      metadata: { name: "LLaMA Block", framework: "pytorch" },
    },
  },
];

export function getTemplatesByCategory(): Record<string, ArchitectureTemplate[]> {
  return ARCHITECTURE_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ArchitectureTemplate[]>);
}

export function getTemplateById(id: string): ArchitectureTemplate | undefined {
  return ARCHITECTURE_TEMPLATES.find(t => t.id === id);
}
