import { useState } from 'react';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { ModelSelector } from './components/ModelSelector';
import { SettingsPage } from './components/SettingsPage';
import { useChat } from './hooks/useChat';
import { Trash2, Settings } from 'lucide-react';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const {
    messages,
    selectedModels,
    isLoading,
    sendMessage,
    clearMessages,
    setModels,
  } = useChat();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Multi-Model Chat
              </h1>
              <p className="text-sm text-gray-500">
                Compare responses from multiple AI models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Chat
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Model Selector */}
        <div className="px-4 pt-4">
          <ModelSelector
            selectedModels={selectedModels}
            onModelSelectionChange={setModels}
            maxModels={5}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 mx-4 mb-4 overflow-hidden">
          <ChatContainer messages={messages} />

          {/* Input Area */}
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={selectedModels.length === 0}
            placeholder={
              selectedModels.length === 0
                ? "Select at least one model to start chatting..."
                : "Ask a question to multiple AI models..."
            }
          />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPage onClose={() => setShowSettings(false)} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>
            Powered by OpenRouter API • Built with React & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

