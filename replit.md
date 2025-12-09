# Neuro-Canvas

## Overview

Neuro-Canvas is a visual, no-code/low-code development environment for designing neural network architectures. Users drag and drop ML building blocks (layers, activations, operations, attention mechanisms) onto an infinite canvas, connect them visually, and generate production-ready code for PyTorch, TensorFlow, or JAX using AI-powered code generation.

The application targets Data Scientists and ML Engineers who want to rapidly prototype complex architectures like Transformers, ResNets, and custom models without writing boilerplate code.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: Zustand store (`client/src/lib/store.ts`) managing canvas nodes, edges, selections, undo/redo stacks, and code generation state
- **Canvas Rendering**: React Flow (@xyflow/react) for the infinite canvas with custom BlockNode components
- **UI Components**: shadcn/ui component library with Radix primitives
- **Styling**: Tailwind CSS with custom design tokens for light/dark themes
- **Code Editor**: Monaco Editor for generated code preview with syntax highlighting via prism-react-renderer

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful endpoints under `/api/*`
- **Code Generation**: OpenAI GPT integration for converting visual graphs to framework-specific Python code
- **Build Tool**: Vite for development, esbuild for production server bundling

### Three-Panel Layout Design
- **Left Sidebar (280px)**: Block library palette organized by category (Layers, Activations, Operations, Attention)
- **Center Canvas**: Infinite pan/zoom workspace using React Flow
- **Right Panel (320px)**: Properties editor for selected nodes + code preview with framework selector

### Data Flow
1. User drags blocks from palette onto canvas
2. Zustand store updates nodes/edges arrays
3. On "Generate Code", graph serializes to JSON and sends to `/api/generate-code`
4. Backend constructs LLM prompt describing architecture topology
5. OpenAI generates Python code for selected framework
6. Code displays in right panel with bidirectional highlighting (code ↔ canvas blocks)

### Block System
- Block definitions in `client/src/lib/blocks.ts` with Zod validation schemas
- Categories: layer, activation, operation, attention
- Each block has typed input/output ports for connection validation
- Parameters adapt dynamically based on block type

## External Dependencies

### AI/LLM Integration
- **OpenAI API**: GPT models for code generation (requires `OPENAI_API_KEY` environment variable)

### Database
- **PostgreSQL**: Configured via Drizzle ORM with schema in `shared/schema.ts`
- **Connection**: Requires `DATABASE_URL` environment variable
- **Session Store**: connect-pg-simple for session persistence

### Key NPM Packages
- `@xyflow/react`: Canvas rendering and node/edge management
- `@monaco-editor/react`: Code editor component
- `@tanstack/react-query`: Server state management
- `drizzle-orm` + `drizzle-zod`: Database ORM with Zod schema integration
- `zod`: Runtime validation for API requests and block parameters

### Fonts
- Inter (Google Fonts): Primary UI typography
- JetBrains Mono (Google Fonts): Monospace for code display