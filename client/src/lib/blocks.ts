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
