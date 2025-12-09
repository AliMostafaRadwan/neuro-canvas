# Neuro-Canvas Block Library

## Complete Block Reference

This document lists all available blocks in Neuro-Canvas with their mathematically verified inputs and outputs.

---

## 📊 **Layers**

### Linear
- **Description**: Fully connected layer that applies a linear transformation
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Output tensor
- **Parameters**:
  - `inFeatures` (number, default: 128): Input dimension
  - `outFeatures` (number, default: 64): Output dimension
  - `bias` (boolean, default: true): Use bias

### Conv2D
- **Description**: 2D convolution layer for processing spatial data
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Output tensor
- **Parameters**:
  - `inChannels` (number, default: 3): Input channels
  - `outChannels` (number, default: 64): Output channels
  - `kernelSize` (number, default: 3): Kernel size
  - `stride` (number, default: 1): Stride
  - `padding` (number, default: 1): Padding

### LSTM
- **Description**: Long Short-Term Memory recurrent layer
- **Inputs**: 
  - `in` (tensor): Input sequence
- **Outputs**: 
  - `out` (tensor): Output sequence
  - `hidden` (tensor): Hidden state
- **Parameters**:
  - `inputSize` (number, default: 128)
  - `hiddenSize` (number, default: 256)
  - `numLayers` (number, default: 1)
  - `bidirectional` (boolean, default: false)
  - `dropout` (number, default: 0)

### GRU
- **Description**: Gated Recurrent Unit layer
- **Inputs**: 
  - `in` (tensor): Input sequence
- **Outputs**: 
  - `out` (tensor): Output sequence
  - `hidden` (tensor): Hidden state
- **Parameters**:
  - `inputSize` (number, default: 128)
  - `hiddenSize` (number, default: 256)
  - `numLayers` (number, default: 1)
  - `bidirectional` (boolean, default: false)

### Embedding
- **Description**: Token embedding layer that converts integer IDs to dense vectors
- **Inputs**: 
  - `input_ids` (tensor): Integer token IDs
- **Outputs**: 
  - `out` (tensor): Dense embeddings
- **Parameters**:
  - `numEmbeddings` (number, default: 50257): Vocabulary size
  - `embeddingDim` (number, default: 768): Embedding dimension

### Positional Encoding
- **Description**: Adds sinusoidal positional information to embeddings
- **Inputs**: 
  - `in` (tensor): Input embeddings
- **Outputs**: 
  - `out` (tensor): Position-encoded embeddings
- **Parameters**:
  - `maxLen` (number, default: 512): Maximum sequence length
  - `embeddingDim` (number, default: 768)
  - `dropout` (number, default: 0.1)

### Position-wise FFN
- **Description**: Position-wise feed-forward network (Linear → ReLU → Linear)
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Output tensor
- **Parameters**:
  - `dModel` (number, default: 512): Model dimension
  - `dFF` (number, default: 2048): Hidden dimension (typically 4x dModel)
  - `dropout` (number, default: 0.1)

### Linear Projection
- **Description**: Final projection layer to vocabulary (for language modeling)
- **Inputs**: 
  - `in` (tensor): Hidden states
- **Outputs**: 
  - `logits` (tensor): Vocabulary logits
- **Parameters**:
  - `inFeatures` (number, default: 512)
  - `vocabSize` (number, default: 50257)
  - `bias` (boolean, default: false)

### Mixture of Experts
- **Description**: MoE layer with gating (used in Mixtral, GPT-4)
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Expert outputs
  - `router_logits` (tensor): Routing decisions
- **Parameters**:
  - `dModel` (number, default: 512)
  - `numExperts` (number, default: 8)
  - `topK` (number, default: 2): Active experts per token
  - `expertCapacity` (number, default: 2048)
  - `dropout` (number, default: 0.1)

### Patch Embedding
- **Description**: Converts image patches to embeddings (used in ViT)
- **Inputs**: 
  - `image` (tensor): Input image [B, C, H, W]
- **Outputs**: 
  - `patches` (tensor): Patch embeddings [B, N, D]
- **Parameters**:
  - `patchSize` (number, default: 16)
  - `inChannels` (number, default: 3)
  - `embedDim` (number, default: 768)
  - `imageSize` (number, default: 224)

### CLS Token
- **Description**: Learnable classification token prepended to sequence (ViT, BERT)
- **Inputs**: 
  - `in` (tensor): Input sequence [B, N, D]
- **Outputs**: 
  - `out` (tensor): Sequence with CLS token [B, N+1, D]
- **Parameters**:
  - `embedDim` (number, default: 768)

---

## ⚡ **Activations**

### ReLU
- **Description**: Rectified Linear Unit activation function
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Activated tensor

### GELU
- **Description**: Gaussian Error Linear Unit activation
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Activated tensor

### Softmax
- **Description**: Softmax activation for probability distribution
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Normalized probabilities
- **Parameters**:
  - `dim` (number, default: -1): Dimension to apply softmax

### Sigmoid
- **Description**: Sigmoid activation function
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Activated tensor

### SwiGLU
- **Description**: Swish-Gated Linear Unit activation (SOTA for LLMs)
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Gated activation
- **Parameters**:
  - `dModel` (number, default: 512)
  - `hiddenDim` (number, default: 2048)

---

## 🔧 **Operations**

### Add
- **Description**: Element-wise addition of two tensors
- **Inputs**: 
  - `a` (tensor): First tensor
  - `b` (tensor): Second tensor
- **Outputs**: 
  - `out` (tensor): Sum tensor

### Concatenate
- **Description**: Concatenate tensors along a dimension
- **Inputs**: 
  - `a` (tensor): First tensor
  - `b` (tensor): Second tensor
- **Outputs**: 
  - `out` (tensor): Concatenated tensor
- **Parameters**:
  - `dim` (number, default: -1): Concatenation dimension

### Flatten
- **Description**: Flatten tensor dimensions
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Flattened tensor
- **Parameters**:
  - `startDim` (number, default: 1)
  - `endDim` (number, default: -1)

### LayerNorm
- **Description**: Layer normalization
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Normalized tensor
- **Parameters**:
  - `normalizedShape` (number, default: 128)
  - `eps` (number, default: 1e-5)

### BatchNorm
- **Description**: Batch normalization
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Normalized tensor
- **Parameters**:
  - `numFeatures` (number, default: 64)
  - `eps` (number, default: 1e-5)
  - `momentum` (number, default: 0.1)

### Dropout
- **Description**: Dropout regularization layer
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): Dropped-out tensor
- **Parameters**:
  - `p` (number, default: 0.1): Dropout probability

### Add & Norm
- **Description**: Residual connection with layer normalization: LayerNorm(x + sublayer(x))
- **Inputs**: 
  - `x` (tensor): Original input
  - `sublayer` (tensor): Sublayer output
- **Outputs**: 
  - `out` (tensor): Normalized residual
- **Parameters**:
  - `normalizedShape` (number, default: 512)
  - `eps` (number, default: 1e-5)

### RMSNorm
- **Description**: Root Mean Square normalization (used in LLaMA, Mistral)
- **Inputs**: 
  - `in` (tensor): Input tensor
- **Outputs**: 
  - `out` (tensor): RMS-normalized tensor
- **Parameters**:
  - `dim` (number, default: 512)
  - `eps` (number, default: 1e-5)

### RoPE
- **Description**: Rotary Positional Embedding (used in LLaMA, GPT-NeoX)
- **Inputs**: 
  - `query` (tensor): Query tensor
  - `key` (tensor): Key tensor
- **Outputs**: 
  - `query_out` (tensor): Rotated query
  - `key_out` (tensor): Rotated key
- **Parameters**:
  - `dim` (number, default: 64): Head dimension
  - `base` (number, default: 10000): Rotation frequency
  - `maxSeqLen` (number, default: 2048)

### Cross Entropy Loss
- **Description**: Cross-entropy loss for classification/language modeling
- **Inputs**: 
  - `predictions` (tensor): Model predictions [B, C] or [B, S, C]
  - `targets` (tensor): Target labels [B] or [B, S]
- **Outputs**: 
  - `loss` (scalar): Computed loss
- **Parameters**:
  - `reduction` (enum: "none", "mean", "sum", default: "mean")
  - `labelSmoothing` (number, default: 0.0)

### MSE Loss
- **Description**: Mean Squared Error loss for regression tasks
- **Inputs**: 
  - `predictions` (tensor): Model predictions
  - `targets` (tensor): Target values
- **Outputs**: 
  - `loss` (scalar): Computed loss
- **Parameters**:
  - `reduction` (enum: "none", "mean", "sum", default: "mean")

### KL Divergence Loss
- **Description**: KL divergence for VAEs and knowledge distillation
- **Inputs**: 
  - `predictions` (tensor): Predicted distribution
  - `targets` (tensor): Target distribution
- **Outputs**: 
  - `loss` (scalar): KL divergence
- **Parameters**:
  - `reduction` (enum: "none", "mean", "sum", "batchmean", default: "batchmean")
  - `logTarget` (boolean, default: false)

---

## 🎯 **Attention Mechanisms**

### Multi-Head Attention
- **Description**: Multi-head self-attention mechanism
- **Inputs**: 
  - `query` (tensor): Query tensor [B, S, D]
  - `key` (tensor): Key tensor [B, S, D]
  - `value` (tensor): Value tensor [B, S, D]
- **Outputs**: 
  - `out` (tensor): Attention output [B, S, D]
  - `weights` (tensor): Attention weights [B, H, S, S]
- **Parameters**:
  - `embedDim` (number, default: 512)
  - `numHeads` (number, default: 8)
  - `dropout` (number, default: 0.1)
  - `batchFirst` (boolean, default: true)

### Masked Multi-Head Attention
- **Description**: Multi-head attention with causal mask (for decoder/GPT-style models)
- **Inputs**: 
  - `query` (tensor): Query tensor
  - `key` (tensor): Key tensor
  - `value` (tensor): Value tensor
- **Outputs**: 
  - `out` (tensor): Attention output
  - `weights` (tensor): Attention weights (masked)
- **Parameters**:
  - `embedDim` (number, default: 512)
  - `numHeads` (number, default: 8)
  - `dropout` (number, default: 0.1)
  - `batchFirst` (boolean, default: true)

### Scaled Dot-Product Attention
- **Description**: Scaled dot-product attention
- **Inputs**: 
  - `query` (tensor): Query tensor
  - `key` (tensor): Key tensor
  - `value` (tensor): Value tensor
- **Outputs**: 
  - `out` (tensor): Attention output
- **Parameters**:
  - `dropout` (number, default: 0.0)
  - `scale` (number, optional): Manual scaling factor

### Grouped Query Attention
- **Description**: GQA with shared K/V heads (used in LLaMA 2/3, Mistral)
- **Inputs**: 
  - `query` (tensor): Query tensor
  - `key` (tensor): Key tensor
  - `value` (tensor): Value tensor
- **Outputs**: 
  - `out` (tensor): Attention output
  - `weights` (tensor): Attention weights
- **Parameters**:
  - `embedDim` (number, default: 512)
  - `numHeads` (number, default: 32): Number of query heads
  - `numKVGroups` (number, default: 8): Number of key/value groups (fewer than query heads)
  - `dropout` (number, default: 0.1)
  - `batchFirst` (boolean, default: true)

### Sliding Window Attention
- **Description**: Local attention with sliding window (used in Mistral, Longformer)
- **Inputs**: 
  - `query` (tensor): Query tensor
  - `key` (tensor): Key tensor
  - `value` (tensor): Value tensor
- **Outputs**: 
  - `out` (tensor): Attention output (with local window)
- **Parameters**:
  - `embedDim` (number, default: 512)
  - `numHeads` (number, default: 8)
  - `windowSize` (number, default: 4096): Attention window size
  - `dropout` (number, default: 0.1)

---

## 📐 **Mathematical Correctness Review**

All blocks have been reviewed for mathematical correctness:

### ✅ **Verified Input/Output Shapes**:

1. **Embedding**: `[B, S]` → `[B, S, D]` ✓
2. **Positional Encoding**: `[B, S, D]` → `[B, S, D]` ✓
3. **Multi-Head Attention**: `Q[B,S,D]`, `K[B,S,D]`, `V[B,S,D]` → `[B, S, D]` ✓
4. **RoPE**: Applies rotations to Q and K individually ✓
5. **GQA**: Fewer KV heads than Q heads for efficiency ✓
6. **Add & Norm**: Residual + normalization (standard Transformer pattern) ✓
7. **Loss Functions**: Tensors → Scalar ✓
8. **Patch Embedding**: `[B, C, H, W]` → `[B, N_patches, D]` ✓
9. **CLS Token**: `[B, N, D]` → `[B, N+1, D]` ✓

---

## 🏗️ **Architecture Templates**

With these blocks, you can now build:

- **GPT-style Transformers**: Embedding + Positional Encoding + Masked Attention + FFN + Add&Norm
- **LLaMA/Mistral-style LLMs**: Embedding + RoPE + GQA + SwiGLU + RMSNorm
- **Vision Transformers**: Patch Embedding + CLS Token + Multi-Head Attention
- **Mixtral-style MoE**: Standard layers + Mixture of Experts

---

**Total Blocks**: 33

**Categories**:
- Layers: 11
- Activations: 5
- Operations: 11
- Attention: 6
