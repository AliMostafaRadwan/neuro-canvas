# Neuro-Canvas: Visual Neural Network Builder 🧠✨

Neuro-Canvas is a powerful, AI-powered visual code generator for neural network architectures. It allows developers, researchers, and students to visually design deep learning models using a drag-and-drop interface and automatically generate production-ready code in **PyTorch**, **TensorFlow**, and **JAX**.

### 🎥 Demo Video

https://github.com/user-attachments/assets/demo.mp4

### 📸 Screenshots

| Website Interface | Recreating Transformers |
|:---:|:---:|
| ![Website Interface](assets/picture.png?v=2) | ![Transformers Architecture](assets/transformers.png) |

> *Easily recreate complex architectures like the Transformer model (right) using our visual builder (left).*

## 🚀 Key Features

*   **Visual Editor**: Intuitive drag-and-drop interface to build complex architectures (ResNets, Transformers, GANs, etc.).
*   **Multi-Framework Support**: Generate code for **PyTorch**, **TensorFlow/Keras**, and **JAX/Flax**.
*   **AI-Powered Generation**: Leverages advanced LLMs to fill in implementation details and generating working boilerplate.
    *   Supported Providers: **Gemini** (Default), **OpenAI**, **Mistral**, **Together AI**, **OpenRouter**.
*   **Real-time Preview**: See the generated Python code instantly as you modify the graph.
*   **Smart Validation**: Automatic prevention of invalid connections (e.g., shape mismatches).
*   **Export Options**: Download as `.py` script or `.ipynb` Jupyter Notebook.
*   **Modern UI**: Built with a sleek, dark-mode-first aesthetic using Tailwind CSS and Shadcn UI.

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, Vite, React Flow (@xyflow/react), Tailwind CSS, Shadcn UI.
*   **Backend**: Node.js, Express.
*   **AI Integration**: Google Generative AI SDK, OpenAI SDK, Mistral AI SDK.
*   **Storage**: Drizzle ORM (PostgreSQL), with on-device/local storage focus.

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AliMostafaRadwan/neuro-canvas.git
    cd neuro-canvas
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory. You can copy the example:
    ```bash
    cp .env.example .env
    ```
    
    Add your API keys for the AI providers you wish to use:
    ```env
    # Required: Choose at least one
    GEMINI_API_KEY=your_key_here
    OPENAI_API_KEY=your_key_here
    MISTRAL_API_KEY=your_key_here
    
    # Server Config
    PORT=5000
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application will generally be available at `http://localhost:5000` (or the port Vite selects).

## 🤖 AI Providers Setup

Neuro-Canvas supports multiple AI backends to generate the code for your blocks.

| Provider | Model Used | Strengths |
|----------|------------|-----------|
| **Gemini** | `gemini-flash-latest` | Very fast, free tier, excellent for general code. |
| **OpenAI** | `gpt-4o` | State-of-the-art reasoning, reliable complex architectures. |
| **Mistral** | `codestral-latest` | Specialized for coding tasks, low latency. |
| **Together** | `Llama-3.1-70B` | Open-source alternative, highly capable. |

See [AI_PROVIDERS.md](./AI_PROVIDERS.md) for detailed configuration instructions.

for free api requests i used a cheap models, you can always change it in the source code

## 📖 Usage

1.  **Sidebar**: Drag "Layers" (Conv2d, Linear, LSTM), "Activations" (ReLU, Gelu), or "Operations" onto the canvas.
2.  **Canvas**: Connect nodes to define the data flow.
3.  **Properties Panel**: Click a node to configure parameters (kernel size, filters, dropout rate, etc.).
4.  **Code Panel**: Select your target framework (e.g., PyTorch) and Provider (e.g., Mistral).
5.  **Generate**: Click "Generate Code" to get the complete Python implementation.
6.  **Export**: Click the download icon to save the code locally.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

---

*Built with ❤️ by Ali Radwan
