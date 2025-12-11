import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mistral } from '@mistralai/mistralai';
import { generateCodeRequestSchema, exportRequestSchema } from "@shared/schema";

// Lazy initialization of AI clients
let openaiClient: OpenAI | null = null;
let geminiClient: GoogleGenerativeAI | null = null;
let mistralClient: Mistral | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set. Please add your OpenAI API key to use OpenAI provider.");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function getGemini(): GoogleGenerativeAI {
  if (!geminiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please add your Gemini API key to use Gemini provider.");
    }
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
}

function getMistral(): Mistral {
  if (!mistralClient) {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error("MISTRAL_API_KEY environment variable is not set. Please add your Mistral API key to use Mistral provider.");
    }
    mistralClient = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  }
  return mistralClient;
}

function getTogetherAPIKey(): string {
  if (!process.env.TOGETHER_API_KEY) {
    throw new Error("TOGETHER_API_KEY environment variable is not set. Please add your Together API key to use Together provider.");
  }
  return process.env.TOGETHER_API_KEY;
}

function getOpenRouterAPIKey(): string {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set. Please add your OpenRouter API key to use OpenRouter provider.");
  }
  return process.env.OPENROUTER_API_KEY;
}


function serializeGraphToPrompt(graph: {
  nodes: { id: string; type: string; label: string; params: Record<string, unknown>; position: { x: number; y: number } }[];
  edges: { id: string; source: string; sourceHandle: string; target: string; targetHandle: string }[];
  metadata?: { name?: string; description?: string; framework?: string };
}, framework: string): string {
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));

  const sortedNodes = [...graph.nodes].sort((a, b) => {
    const aIsSource = graph.edges.some(e => e.source === a.id);
    const aIsTarget = graph.edges.some(e => e.target === a.id);
    const bIsSource = graph.edges.some(e => e.source === b.id);
    const bIsTarget = graph.edges.some(e => e.target === b.id);

    if (!aIsTarget && bIsTarget) return -1;
    if (aIsTarget && !bIsTarget) return 1;
    return a.position.y - b.position.y;
  });

  const nodeDescriptions = sortedNodes.map(node => {
    const paramStr = Object.entries(node.params)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(", ");
    return `- ${node.id} (${node.label}): ${node.type}(${paramStr})`;
  }).join("\n");

  const connectionDescriptions = graph.edges.map(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    return `- ${sourceNode?.label || edge.source}.${edge.sourceHandle} -> ${targetNode?.label || edge.target}.${edge.targetHandle}`;
  }).join("\n");

  const frameworkImports: Record<string, string> = {
    pytorch: "import torch\nimport torch.nn as nn\nimport torch.nn.functional as F",
    tensorflow: "import tensorflow as tf\nfrom tensorflow import keras\nfrom tensorflow.keras import layers",
    jax: "import jax\nimport jax.numpy as jnp\nfrom flax import linen as nn",
  };

  return `Generate a ${framework.toUpperCase()} neural network model based on the following architecture:

NODES (layers/operations):
${nodeDescriptions}

DATA FLOW (connections):
${connectionDescriptions || "Sequential flow through nodes in order listed"}

REQUIREMENTS:
1. Create a proper neural network class that implements this architecture
2. Use proper ${framework} conventions and best practices
3. Handle the data flow correctly, especially for residual/skip connections if present
4. Include type hints and docstrings
5. The forward method should properly route tensors through the network
6. Include example usage showing how to instantiate and run the model

Start with:
${frameworkImports[framework] || frameworkImports.pytorch}

Generate clean, production-ready code. Only output the Python code, no explanations.`;
}

function generateNodeMapping(code: string, nodes: { id: string; label: string }[]): Record<string, { startLine: number; endLine: number }> {
  const mapping: Record<string, { startLine: number; endLine: number }> = {};
  const lines = code.split("\n");

  nodes.forEach(node => {
    const labelLower = node.label.toLowerCase().replace(/[^a-z0-9]/g, "");
    const idMatch = node.id.replace("node_", "");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (
        line.includes(`self.${labelLower}`) ||
        line.includes(`self.layer${idMatch}`) ||
        line.includes(node.label.toLowerCase())
      ) {
        if (!mapping[node.id]) {
          mapping[node.id] = { startLine: i + 1, endLine: i + 1 };
        } else {
          mapping[node.id].endLine = i + 1;
        }
      }
    }
  });

  return mapping;
}

async function generateCodeWithProvider(
  prompt: string,
  framework: string,
  provider: "gemini" | "openai" | "together" | "openrouter" | "mistral"
): Promise<string> {
  const systemMessage = `You are an expert ML engineer who writes clean, production-ready ${framework} code. Generate only valid Python code without markdown formatting or code blocks. The code should be immediately executable.`;

  if (provider === "gemini") {
    const model = getGemini().getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemMessage,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    let code = response.text();

    // Clean up markdown code blocks if present
    code = code.replace(/```python\n?/g, "").replace(/```\n?/g, "").trim();
    return code;

  } else if (provider === "openai") {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 4096,
    });

    let code = response.choices[0]?.message?.content || "";
    code = code.replace(/```python\n?/g, "").replace(/```\n?/g, "").trim();
    return code;

  } else if (provider === "together") {
    // Together AI uses OpenAI-compatible API
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getTogetherAPIKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Together API error: ${error}`);
    }

    const data = await response.json();
    let code = data.choices[0]?.message?.content || "";
    code = code.replace(/```python\n?/g, "").replace(/```\n?/g, "").trim();
  } else if (provider === "openrouter") {
    // OpenRouter provides access to many models through a unified API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getOpenRouterAPIKey()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://neuro-canvas.app",
        "X-Title": "Neuro-Canvas",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    let code = data.choices[0]?.message?.content || "";
    code = code.replace(/```python\n?/g, "").replace(/```\n?/g, "").trim();
    return code;
  } else if (provider === "mistral") {
    const response = await getMistral().chat.complete({
      model: 'codestral-latest',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
    });

    let code = (response.choices && response.choices[0] && response.choices[0].message.content) as string || "";
    code = code.replace(/```python\n?/g, "").replace(/```\n?/g, "").trim();
    return code;
  }

  throw new Error(`Unknown provider: ${provider}`);
}


function generateJupyterNotebook(code: string): object {
  return {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
      language_info: {
        name: "python",
        version: "3.10.0",
      },
    },
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: ["# Neural Network Architecture\n", "\n", "Generated by Neuro-Canvas"],
      },
      {
        cell_type: "code",
        metadata: {},
        source: ["# Install dependencies if needed\n", "# !pip install torch"],
        execution_count: null,
        outputs: [],
      },
      {
        cell_type: "code",
        metadata: {},
        source: code.split("\n").map((line, i, arr) =>
          i === arr.length - 1 ? line : line + "\n"
        ),
        execution_count: null,
        outputs: [],
      },
      {
        cell_type: "markdown",
        metadata: {},
        source: ["## Training Loop\n", "\n", "Add your training code below:"],
      },
      {
        cell_type: "code",
        metadata: {},
        source: [
          "# Example training loop\n",
          "# optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)\n",
          "# criterion = nn.CrossEntropyLoss()\n",
          "#\n",
          "# for epoch in range(num_epochs):\n",
          "#     for batch in dataloader:\n",
          "#         optimizer.zero_grad()\n",
          "#         outputs = model(batch)\n",
          "#         loss = criterion(outputs, targets)\n",
          "#         loss.backward()\n",
          "#         optimizer.step()\n",
        ],
        execution_count: null,
        outputs: [],
      },
    ],
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/generate-code", async (req, res) => {
    try {
      const parsed = generateCodeRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: parsed.error.errors
        });
      }

      const { graph, framework, provider } = parsed.data;

      if (graph.nodes.length === 0) {
        return res.status(400).json({ error: "Graph has no nodes" });
      }

      const prompt = serializeGraphToPrompt(graph, framework);

      // Generate code using the selected provider
      const code = await generateCodeWithProvider(prompt, framework, provider);

      const nodeMapping = generateNodeMapping(code, graph.nodes);

      res.json({
        code,
        framework,
        nodeMapping,
      });
    } catch (error) {
      console.error("Code generation error:", error);
      res.status(500).json({
        error: "Failed to generate code",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post("/api/export", async (req, res) => {
    try {
      const parsed = exportRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: parsed.error.errors
        });
      }

      const { code, format, filename = "neural_network" } = parsed.data;

      if (format === "py") {
        res.setHeader("Content-Type", "text/x-python");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}.py"`);
        res.send(code);
      } else if (format === "ipynb") {
        const notebook = generateJupyterNotebook(code);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}.ipynb"`);
        res.send(JSON.stringify(notebook, null, 2));
      } else if (format === "yaml" || format === "json") {
        res.status(501).json({ error: "Format not yet implemented" });
      } else {
        res.status(400).json({ error: "Unsupported format" });
      }
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({
        error: "Failed to export",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  return httpServer;
}
