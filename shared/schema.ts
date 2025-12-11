import { z } from "zod";

// Block categories for visual distinction
export type BlockCategory = "layer" | "activation" | "operation" | "attention";

// Port types for connection validation
export type PortType = "tensor" | "scalar" | "any";

// Port position for multi-directional handles
export type PortPosition = "top" | "right" | "bottom" | "left";

// Block port definition
export interface BlockPort {
  id: string;
  type: PortType;
  label?: string;
  position?: PortPosition;
}

// Base block definition for the palette
export interface BlockDefinition {
  type: string;
  label: string;
  category: BlockCategory;
  description: string;
  inputs: BlockPort[];
  outputs: BlockPort[];
  defaultParams: Record<string, unknown>;
  paramSchema: z.ZodSchema;
}

// Node data stored in React Flow nodes
export interface NodeData extends Record<string, unknown> {
  blockType: string;
  label: string;
  category: BlockCategory;
  params: Record<string, unknown>;
  inputShape?: number[];
  outputShape?: number[];
  isSelected?: boolean;
  isHovered?: boolean;
  isHighlighted?: boolean;
}

// Edge data for connections
export interface EdgeData extends Record<string, unknown> {
  isValid: boolean;
  errorMessage?: string;
}

// Serialized graph for API
export interface SerializedNode {
  id: string;
  type: string;
  label: string;
  params: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface SerializedEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

export interface SerializedGraph {
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  metadata?: {
    name?: string;
    description?: string;
    framework?: string;
  };
}

// Code generation request/response
export const generateCodeRequestSchema = z.object({
  graph: z.object({
    nodes: z.array(z.object({
      id: z.string(),
      type: z.string(),
      label: z.string(),
      params: z.record(z.unknown()),
      position: z.object({ x: z.number(), y: z.number() }),
    })),
    edges: z.array(z.object({
      id: z.string(),
      source: z.string(),
      sourceHandle: z.string(),
      target: z.string(),
      targetHandle: z.string(),
    })),
    metadata: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      framework: z.string().optional(),
    }).optional(),
  }),
  framework: z.enum(["pytorch", "tensorflow", "jax"]).default("pytorch"),
  provider: z.enum(["gemini", "openai", "together", "openrouter", "mistral"]).default("gemini"),
});

export type GenerateCodeRequest = z.infer<typeof generateCodeRequestSchema>;

export interface GenerateCodeResponse {
  code: string;
  framework: string;
  nodeMapping: Record<string, { startLine: number; endLine: number }>;
}

// Export request
export const exportRequestSchema = z.object({
  code: z.string(),
  format: z.enum(["py", "ipynb", "yaml", "json"]),
  filename: z.string().optional(),
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;

// Super-Block (grouped nodes)
export interface SuperBlock {
  id: string;
  name: string;
  nodeIds: string[];
  position: { x: number; y: number };
  isCollapsed: boolean;
}

// Template for marketplace
export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  graph: SerializedGraph;
  thumbnail?: string;
}

// Version snapshot
export interface VersionSnapshot {
  id: string;
  name: string;
  timestamp: number;
  graph: SerializedGraph;
}

// Users table (keep existing for auth if needed)
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
