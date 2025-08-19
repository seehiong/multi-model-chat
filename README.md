# Multi-Model Chat

A modern web application that allows you to chat with multiple large language models simultaneously and compare their responses in real-time.

### ✨ [**View Live Demo**](https://your-demo-site-url.com) ✨

*(Replace the link above with your actual deployment URL)*

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

3.  **Set up environment variables:**

    This project uses [OpenRouter.ai](https://openrouter.ai/) to access many different models via a single API key. You can get a free key from their website.

    Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```

    Open the `.env` file and add your OpenRouter API Key. **Note:** The `VITE_` prefix is required by Vite to expose the variable to the frontend code.
    ```env
    # .env
    VITE_OPENROUTER_API_KEY="your-openrouter-api-key-here"
    ```
    *This key is only used on the client-side and is stored in your browser's local storage via the Settings page. It is never committed to the repository.*

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Your application should now be running on `http://localhost:3000` (or another port if 3000 is in use).

## Usage

1.  Open the application in your browser.
2.  Click the **Settings** button to enter your OpenRouter API Key.
3.  Configure any **Local Models** you are running (e.g., via Ollama).
4.  Return to the main page, select the models you want to chat with.
5.  Type your message and press Enter!

## Deployment

This application is optimized for deployment on static hosting platforms like Vercel, Netlify, or Cloudflare Pages.

### Deploying with Vercel

1.  Fork this repository to your own GitHub account.
2.  Go to [Vercel](https://vercel.com/) and create a new project, importing your forked repository.
3.  Vercel will automatically detect that it is a Vite project and configure the build settings.
4.  **There are no server-side environment variables to set.** The API key is managed on the client side.
5.  Deploy!

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
├── .env.example           # Environment variable template
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