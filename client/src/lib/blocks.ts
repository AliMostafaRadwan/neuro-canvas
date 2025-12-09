import { z } from "zod";
import type { BlockDefinition, BlockCategory } from "@shared/schema";

// Parameter schemas for each block type
const linearParamSchema = z.object({
  inFeatures: z.number().min(1).default(128),
  outFeatures: z.number().min(1).default(64),
  bias: z.boolean().default(true),
});

const conv2dParamSchema = z.object({
  inChannels: z.number().min(1).default(3),
  outChannels: z.number().min(1).default(64),
  kernelSize: z.number().min(1).default(3),
  stride: z.number().min(1).default(1),
  padding: z.number().min(0).default(1),
});

const lstmParamSchema = z.object({
  inputSize: z.number().min(1).default(128),
  hiddenSize: z.number().min(1).default(256),
  numLayers: z.number().min(1).default(1),
  bidirectional: z.boolean().default(false),
  dropout: z.number().min(0).max(1).default(0),
});

const gruParamSchema = z.object({
  inputSize: z.number().min(1).default(128),
  hiddenSize: z.number().min(1).default(256),
  numLayers: z.number().min(1).default(1),
  bidirectional: z.boolean().default(false),
});

const activationParamSchema = z.object({});

const softmaxParamSchema = z.object({
  dim: z.number().default(-1),
});

const normParamSchema = z.object({
  normalizedShape: z.number().min(1).default(128),
  eps: z.number().default(1e-5),
});

const batchNormParamSchema = z.object({
  numFeatures: z.number().min(1).default(64),
  eps: z.number().default(1e-5),
  momentum: z.number().default(0.1),
});

const dropoutParamSchema = z.object({
  p: z.number().min(0).max(1).default(0.1),
});

const multiHeadAttentionParamSchema = z.object({
  embedDim: z.number().min(1).default(512),
  numHeads: z.number().min(1).default(8),
  dropout: z.number().min(0).max(1).default(0.1),
  batchFirst: z.boolean().default(true),
});

const scaledDotProductParamSchema = z.object({
  dropout: z.number().min(0).max(1).default(0.0),
  scale: z.number().optional(),
});

const addParamSchema = z.object({});
const concatParamSchema = z.object({
  dim: z.number().default(-1),
});
const flattenParamSchema = z.object({
  startDim: z.number().default(1),
  endDim: z.number().default(-1),
});

// Transformer Architecture Blocks
const embeddingParamSchema = z.object({
  numEmbeddings: z.number().min(1).default(50257), // vocab size
  embeddingDim: z.number().min(1).default(768),
});

const positionalEncodingParamSchema = z.object({
  maxLen: z.number().min(1).default(512),
  embeddingDim: z.number().min(1).default(768),
  dropout: z.number().min(0).max(1).default(0.1),
});

const maskedMultiHeadAttentionParamSchema = z.object({
  embedDim: z.number().min(1).default(512),
  numHeads: z.number().min(1).default(8),
  dropout: z.number().min(0).max(1).default(0.1),
  batchFirst: z.boolean().default(true),
});

const positionWiseFFNParamSchema = z.object({
  dModel: z.number().min(1).default(512),
  dFF: z.number().min(1).default(2048), // typically 4x dModel
  dropout: z.number().min(0).max(1).default(0.1),
});

const addNormParamSchema = z.object({
  normalizedShape: z.number().min(1).default(512),
  eps: z.number().default(1e-5),
});

const linearProjectionParamSchema = z.object({
  inFeatures: z.number().min(1).default(512),
  vocabSize: z.number().min(1).default(50257),
  bias: z.boolean().default(false),
});

// Modern LLM Blocks
const rmsNormParamSchema = z.object({
  dim: z.number().min(1).default(512),
  eps: z.number().default(1e-5),
});

const swiGLUParamSchema = z.object({
  dModel: z.number().min(1).default(512),
  hiddenDim: z.number().min(1).default(2048),
});

const ropeParamSchema = z.object({
  dim: z.number().min(1).default(64), // head dimension
  base: z.number().default(10000),
  maxSeqLen: z.number().min(1).default(2048),
});

const groupedQueryAttentionParamSchema = z.object({
  embedDim: z.number().min(1).default(512),
  numHeads: z.number().min(1).default(32),
  numKVGroups: z.number().min(1).default(8), // GQA: fewer KV heads than Q heads
  dropout: z.number().min(0).max(1).default(0.1),
  batchFirst: z.boolean().default(true),
});

const slidingWindowAttentionParamSchema = z.object({
  embedDim: z.number().min(1).default(512),
  numHeads: z.number().min(1).default(8),
  windowSize: z.number().min(1).default(4096),
  dropout: z.number().min(0).max(1).default(0.1),
});

const mixtureOfExpertsParamSchema = z.object({
  dModel: z.number().min(1).default(512),
  numExperts: z.number().min(1).default(8),
  topK: z.number().min(1).default(2), // active experts per token
  expertCapacity: z.number().min(1).default(2048),
  dropout: z.number().min(0).max(1).default(0.1),
});

// Vision Transformer Blocks
const patchEmbeddingParamSchema = z.object({
  patchSize: z.number().min(1).default(16),
  inChannels: z.number().min(1).default(3),
  embedDim: z.number().min(1).default(768),
  imageSize: z.number().min(1).default(224),
});

const clsTokenParamSchema = z.object({
  embedDim: z.number().min(1).default(768),
});

// Loss Functions
const crossEntropyLossParamSchema = z.object({
  reduction: z.enum(["none", "mean", "sum"]).default("mean"),
  labelSmoothing: z.number().min(0).max(1).default(0.0),
});

const mseLossParamSchema = z.object({
  reduction: z.enum(["none", "mean", "sum"]).default("mean"),
});

const klDivergenceLossParamSchema = z.object({
  reduction: z.enum(["none", "mean", "sum", "batchmean"]).default("batchmean"),
  logTarget: z.boolean().default(false),
});

// Block definitions
export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  // Layers
  {
    type: "linear",
    label: "Linear",
    category: "layer",
    description: "Fully connected layer that applies a linear transformation",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { inFeatures: 128, outFeatures: 64, bias: true },
    paramSchema: linearParamSchema,
  },
  {
    type: "conv2d",
    label: "Conv2D",
    category: "layer",
    description: "2D convolution layer for processing spatial data",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { inChannels: 3, outChannels: 64, kernelSize: 3, stride: 1, padding: 1 },
    paramSchema: conv2dParamSchema,
  },
  {
    type: "lstm",
    label: "LSTM",
    category: "layer",
    description: "Long Short-Term Memory recurrent layer",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [
      { id: "out", type: "tensor", label: "Output" },
      { id: "hidden", type: "tensor", label: "Hidden" },
    ],
    defaultParams: { inputSize: 128, hiddenSize: 256, numLayers: 1, bidirectional: false, dropout: 0 },
    paramSchema: lstmParamSchema,
  },
  {
    type: "gru",
    label: "GRU",
    category: "layer",
    description: "Gated Recurrent Unit layer",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [
      { id: "out", type: "tensor", label: "Output" },
      { id: "hidden", type: "tensor", label: "Hidden" },
    ],
    defaultParams: { inputSize: 128, hiddenSize: 256, numLayers: 1, bidirectional: false },
    paramSchema: gruParamSchema,
  },
  // Activations
  {
    type: "relu",
    label: "ReLU",
    category: "activation",
    description: "Rectified Linear Unit activation function",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: {},
    paramSchema: activationParamSchema,
  },
  {
    type: "gelu",
    label: "GELU",
    category: "activation",
    description: "Gaussian Error Linear Unit activation",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: {},
    paramSchema: activationParamSchema,
  },
  {
    type: "softmax",
    label: "Softmax",
    category: "activation",
    description: "Softmax activation for probability distribution",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { dim: -1 },
    paramSchema: softmaxParamSchema,
  },
  {
    type: "sigmoid",
    label: "Sigmoid",
    category: "activation",
    description: "Sigmoid activation function",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: {},
    paramSchema: activationParamSchema,
  },
  // Operations
  {
    type: "add",
    label: "Add",
    category: "operation",
    description: "Element-wise addition of two tensors",
    inputs: [
      { id: "a", type: "tensor", label: "A" },
      { id: "b", type: "tensor", label: "B" },
    ],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: {},
    paramSchema: addParamSchema,
  },
  {
    type: "concat",
    label: "Concatenate",
    category: "operation",
    description: "Concatenate tensors along a dimension",
    inputs: [
      { id: "a", type: "tensor", label: "A" },
      { id: "b", type: "tensor", label: "B" },
    ],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { dim: -1 },
    paramSchema: concatParamSchema,
  },
  {
    type: "flatten",
    label: "Flatten",
    category: "operation",
    description: "Flatten tensor dimensions",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { startDim: 1, endDim: -1 },
    paramSchema: flattenParamSchema,
  },
  {
    type: "layernorm",
    label: "LayerNorm",
    category: "operation",
    description: "Layer normalization",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { normalizedShape: 128, eps: 1e-5 },
    paramSchema: normParamSchema,
  },
  {
    type: "batchnorm",
    label: "BatchNorm",
    category: "operation",
    description: "Batch normalization",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { numFeatures: 64, eps: 1e-5, momentum: 0.1 },
    paramSchema: batchNormParamSchema,
  },
  {
    type: "dropout",
    label: "Dropout",
    category: "operation",
    description: "Dropout regularization layer",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { p: 0.1 },
    paramSchema: dropoutParamSchema,
  },
  // Attention
  {
    type: "multihead_attention",
    label: "Multi-Head Attention",
    category: "attention",
    description: "Multi-head self-attention mechanism",
    inputs: [
      { id: "query", type: "tensor", label: "Query" },
      { id: "key", type: "tensor", label: "Key" },
      { id: "value", type: "tensor", label: "Value" },
    ],
    outputs: [
      { id: "out", type: "tensor", label: "Output" },
      { id: "weights", type: "tensor", label: "Attn Weights" },
    ],
    defaultParams: { embedDim: 512, numHeads: 8, dropout: 0.1, batchFirst: true },
    paramSchema: multiHeadAttentionParamSchema,
  },
  {
    type: "scaled_dot_product",
    label: "Scaled Dot-Product",
    category: "attention",
    description: "Scaled dot-product attention",
    inputs: [
      { id: "query", type: "tensor", label: "Query" },
      { id: "key", type: "tensor", label: "Key" },
      { id: "value", type: "tensor", label: "Value" },
    ],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { dropout: 0.0 },
    paramSchema: scaledDotProductParamSchema,
  },

  // === TRANSFORMER ARCHITECTURE BLOCKS ===
  {
    type: "embedding",
    label: "Embedding",
    category: "layer",
    description: "Token embedding layer that converts integer IDs to dense vectors",
    inputs: [{ id: "input_ids", type: "tensor", label: "Input IDs" }],
    outputs: [{ id: "out", type: "tensor", label: "Embeddings" }],
    defaultParams: { numEmbeddings: 50257, embeddingDim: 768 },
    paramSchema: embeddingParamSchema,
  },
  {
    type: "positional_encoding",
    label: "Positional Encoding",
    category: "layer",
    description: "Adds sinusoidal positional information to embeddings",
    inputs: [{ id: "in", type: "tensor", label: "Embeddings" }],
    outputs: [{ id: "out", type: "tensor", label: "Encoded" }],
    defaultParams: { maxLen: 512, embeddingDim: 768, dropout: 0.1 },
    paramSchema: positionalEncodingParamSchema,
  },
  {
    type: "masked_multihead_attention",
    label: "Masked Multi-Head Attention",
    category: "attention",
    description: "Multi-head attention with causal mask (for decoder/GPT-style models)",
    inputs: [
      { id: "query", type: "tensor", label: "Query" },
      { id: "key", type: "tensor", label: "Key" },
      { id: "value", type: "tensor", label: "Value" },
    ],
    outputs: [
      { id: "out", type: "tensor", label: "Output" },
      { id: "weights", type: "tensor", label: "Attn Weights" },
    ],
    defaultParams: { embedDim: 512, numHeads: 8, dropout: 0.1, batchFirst: true },
    paramSchema: maskedMultiHeadAttentionParamSchema,
  },
  {
    type: "position_wise_ffn",
    label: "Position-wise FFN",
    category: "layer",
    description: "Position-wise feed-forward network (Linear -> ReLU -> Linear)",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { dModel: 512, dFF: 2048, dropout: 0.1 },
    paramSchema: positionWiseFFNParamSchema,
  },
  {
    type: "add_norm",
    label: "Add & Norm",
    category: "operation",
    description: "Residual connection with layer normalization: LayerNorm(x + sublayer(x))",
    inputs: [
      { id: "x", type: "tensor", label: "Input" },
      { id: "sublayer", type: "tensor", label: "Sublayer Output" },
    ],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { normalizedShape: 512, eps: 1e-5 },
    paramSchema: addNormParamSchema,
  },
  {
    type: "linear_projection",
    label: "Linear Projection",
    category: "layer",
    description: "Final projection layer to vocabulary (for language modeling)",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "logits", type: "tensor", label: "Logits" }],
    defaultParams: { inFeatures: 512, vocabSize: 50257, bias: false },
    paramSchema: linearProjectionParamSchema,
  },

  // === MODERN LLM BLOCKS ===
  {
    type: "rmsnorm",
    label: "RMSNorm",
    category: "operation",
    description: "Root Mean Square normalization (used in LLaMA, Mistral)",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { dim: 512, eps: 1e-5 },
    paramSchema: rmsNormParamSchema,
  },
  {
    type: "swiglu",
    label: "SwiGLU",
    category: "activation",
    description: "Swish-Gated Linear Unit activation (SOTA for LLMs)",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { dModel: 512, hiddenDim: 2048 },
    paramSchema: swiGLUParamSchema,
  },
  {
    type: "rope",
    label: "RoPE",
    category: "operation",
    description: "Rotary Positional Embedding (used in LLaMA, GPT-NeoX)",
    inputs: [
      { id: "query", type: "tensor", label: "Query" },
      { id: "key", type: "tensor", label: "Key" },
    ],
    outputs: [
      { id: "query_out", type: "tensor", label: "Rotated Query" },
      { id: "key_out", type: "tensor", label: "Rotated Key" },
    ],
    defaultParams: { dim: 64, base: 10000, maxSeqLen: 2048 },
    paramSchema: ropeParamSchema,
  },
  {
    type: "grouped_query_attention",
    label: "Grouped Query Attention",
    category: "attention",
    description: "GQA with shared K/V heads (used in LLaMA 2/3, Mistral)",
    inputs: [
      { id: "query", type: "tensor", label: "Query" },
      { id: "key", type: "tensor", label: "Key" },
      { id: "value", type: "tensor", label: "Value" },
    ],
    outputs: [
      { id: "out", type: "tensor", label: "Output" },
      { id: "weights", type: "tensor", label: "Attn Weights" },
    ],
    defaultParams: { embedDim: 512, numHeads: 32, numKVGroups: 8, dropout: 0.1, batchFirst: true },
    paramSchema: groupedQueryAttentionParamSchema,
  },
  {
    type: "sliding_window_attention",
    label: "Sliding Window Attention",
    category: "attention",
    description: "Local attention with sliding window (used in Mistral, Longformer)",
    inputs: [
      { id: "query", type: "tensor", label: "Query" },
      { id: "key", type: "tensor", label: "Key" },
      { id: "value", type: "tensor", label: "Value" },
    ],
    outputs: [{ id: "out", type: "tensor", label: "Output" }],
    defaultParams: { embedDim: 512, numHeads: 8, windowSize: 4096, dropout: 0.1 },
    paramSchema: slidingWindowAttentionParamSchema,
  },
  {
    type: "mixture_of_experts",
    label: "Mixture of Experts",
    category: "layer",
    description: "MoE layer with gating (used in Mixtral, GPT-4)",
    inputs: [{ id: "in", type: "tensor", label: "Input" }],
    outputs: [
      { id: "out", type: "tensor", label: "Output" },
      { id: "router_logits", type: "tensor", label: "Router Logits" },
    ],
    defaultParams: { dModel: 512, numExperts: 8, topK: 2, expertCapacity: 2048, dropout: 0.1 },
    paramSchema: mixtureOfExpertsParamSchema,
  },

  // === VISION TRANSFORMER BLOCKS ===
  {
    type: "patch_embedding",
    label: "Patch Embedding",
    category: "layer",
    description: "Converts image patches to embeddings (used in ViT)",
    inputs: [{ id: "image", type: "tensor", label: "Image" }],
    outputs: [{ id: "patches", type: "tensor", label: "Patch Embeddings" }],
    defaultParams: { patchSize: 16, inChannels: 3, embedDim: 768, imageSize: 224 },
    paramSchema: patchEmbeddingParamSchema,
  },
  {
    type: "cls_token",
    label: "CLS Token",
    category: "layer",
    description: "Learnable classification token prepended to sequence (ViT, BERT)",
    inputs: [{ id: "in", type: "tensor", label: "Sequence" }],
    outputs: [{ id: "out", type: "tensor", label: "With CLS" }],
    defaultParams: { embedDim: 768 },
    paramSchema: clsTokenParamSchema,
  },

  // === LOSS FUNCTIONS ===
  {
    type: "cross_entropy_loss",
    label: "Cross Entropy Loss",
    category: "operation",
    description: "Cross-entropy loss for classification/language modeling",
    inputs: [
      { id: "predictions", type: "tensor", label: "Predictions" },
      { id: "targets", type: "tensor", label: "Targets" },
    ],
    outputs: [{ id: "loss", type: "scalar", label: "Loss" }],
    defaultParams: { reduction: "mean", labelSmoothing: 0.0 },
    paramSchema: crossEntropyLossParamSchema,
  },
  {
    type: "mse_loss",
    label: "MSE Loss",
    category: "operation",
    description: "Mean Squared Error loss for regression tasks",
    inputs: [
      { id: "predictions", type: "tensor", label: "Predictions" },
      { id: "targets", type: "tensor", label: "Targets" },
    ],
    outputs: [{ id: "loss", type: "scalar", label: "Loss" }],
    defaultParams: { reduction: "mean" },
    paramSchema: mseLossParamSchema,
  },
  {
    type: "kl_divergence_loss",
    label: "KL Divergence Loss",
    category: "operation",
    description: "KL divergence for VAEs and knowledge distillation",
    inputs: [
      { id: "predictions", type: "tensor", label: "Predictions" },
      { id: "targets", type: "tensor", label: "Targets" },
    ],
    outputs: [{ id: "loss", type: "scalar", label: "Loss" }],
    defaultParams: { reduction: "batchmean", logTarget: false },
    paramSchema: klDivergenceLossParamSchema,
  },
];

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return BLOCK_DEFINITIONS.find(b => b.type === type);
}

export function getBlocksByCategory(category: BlockCategory): BlockDefinition[] {
  return BLOCK_DEFINITIONS.filter(b => b.category === category);
}

export function validateBlockParams(type: string, params: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const definition = getBlockDefinition(type);
  if (!definition) {
    return { valid: false, errors: ["Unknown block type"] };
  }

  const result = definition.paramSchema.safeParse(params);
  if (result.success) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`),
  };
}
