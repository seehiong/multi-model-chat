# Multi-Model Chat

A modern web application that allows you to chat with multiple large language models simultaneously and compare their responses in real-time.

### ✨ [**View Live Demo**](https://seehiong.github.io/multi-model-chat/) ✨

## Screenshot

![Multi-Model Chat Screenshot](multi-model-chat-compare.png)

## Features

-   **Concurrent Model Queries**: Chat with up to 5 different AI models at the same time.
-   **Real-time UI Updates**: See responses from each model appear individually as soon as they are available.
-   **Local Model Support**: Connect to locally hosted models (e.g., via Ollama) and compare them against cloud-based APIs.
-   **Remote API Integration**: Natively supports any OpenAI-compatible endpoint, with OpenRouter configured out of the box.
-   **Markdown Rendering**: Displays responses with rich text formatting and syntax highlighting for code.
-   **Persistent Settings**: Your API keys and model configurations are saved locally in your browser.
-   **Responsive Design**: A clean, modern UI that works seamlessly on desktop and mobile devices.

## Supported Models

This application can connect to a wide variety of models through services like OpenRouter or by connecting to your own local servers. The default configuration includes:

-   **GPT-4.1 Mini** (OpenAI)
-   **Claude 3 Haiku** (Anthropic)
-   **Mistral Codestral 2508** (Mistral AI)
-   And any local model you configure!

## Tech Stack

-   **Frontend**: React 18 + TypeScript + Vite
-   **Styling**: Tailwind CSS
-   **State Management**: React Hooks
-   **Markdown**: `react-markdown` with `rehype-highlight`
-   **Icons**: Lucide React

## Getting Started

### Prerequisites

-   Node.js v18 or later
-   NPM, Yarn, or PNPM

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/seehiong/multi-model-chat.git
    cd multi-model-chat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Your application should now be running on `http://localhost:3000` (or another port if 3000 is in use).

## Usage

1.  Open the application in your browser.
2.  To query remote models, you will need an API key from a service like [OpenRouter.ai](https://openrouter.ai/).
3.  Navigate to the **Settings** page in the application and paste your API key into the "OpenRouter API Key" field. The key is saved to your browser's `localStorage`.
4.  **Important Security Note:** For maximum security, it is recommended to create temporary keys on your provider's dashboard (like OpenRouter) for your sessions and delete them when you are finished.
5.  On the settings page, you can also configure any **Local Models** you are running (e.g., via Ollama).
6.  Return to the main page, select the models you want to chat with, and start your conversation!

## Building and Local Usage

This application is fully client-side and serverless. All API requests go directly from your browser to the endpoints (e.g., OpenRouter or local servers), with settings and API keys stored securely in your browser's local storage.

### 1. Offline Mode (Single Self-Contained HTML)

You can build the entire application into a **single, self-contained HTML file** that can be opened by double-clicking from your file manager, emailed, or stored offline:

```bash
npm run build:single
```

This compiles all React components, styling, logic, and assets into a single file at `dist/index.html`. 
- **How to run:** Double-click `dist/index.html` to open it directly via the `file://` protocol in any browser.

### 2. Relative Path Static Build (For General Hosting & GitHub Pages)

To deploy to any standard static file host (e.g., Netlify, Cloudflare Pages, or a local static server like `serve` or Live Server):

```bash
npm run build
```

This compiles the app with relative paths (`base: './'`) in the `dist/` directory. Simply upload or serve the contents of the `dist/` directory.

#### Deploying Automatically to GitHub Pages
A GitHub Actions workflow is configured in `.github/workflows/deploy.yml` to automatically build and host the application on GitHub Pages whenever you push to the `main` branch.

To set it up:
1. Push the code to your GitHub repository.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push a commit or trigger the workflow manually under the **Actions** tab on GitHub, and your app will be hosted automatically.

## CORS Configuration for Local Models (Ollama)

When querying local models (like Ollama running on `http://127.0.0.1:11434`) directly from the browser (either via `file://` or a local web page), the browser's security model (CORS) may block the requests.

To allow connection:
- **On Windows**:
  1. Close Ollama from the taskbar tray.
  2. Open PowerShell or Command Prompt.
  3. Run: `setx OLLAMA_ORIGINS "*"` (or `$env:OLLAMA_ORIGINS="*"` for the current session).
  4. Start Ollama.
- **On macOS/Linux**:
  Launch Ollama with the environment variable set:
  ```bash
  OLLAMA_ORIGINS="*" ollama serve
  ```

## Project Structure

```
.
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   ├── config/            # Model configurations
│   ├── hooks/             # Custom React hooks (useChat)
│   ├── services/          # API and Settings services
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
└── package.json
```

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to improve the code, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some amazing feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.