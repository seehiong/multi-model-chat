import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { getModelById } from '../config/models';
import { SettingsService } from '../services/settings';

interface ChatContainerProps {
  messages: ChatMessageType[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Group messages by user message and model responses
  const groupedMessages = React.useMemo(() => {
    const groups: Array<{
      id: string;
      userMessage: ChatMessageType;
      modelResponses: ChatMessageType[];
    }> = [];

    let currentGroup: {
      id: string;
      userMessage: ChatMessageType;
      modelResponses: ChatMessageType[];
    } | null = null;

    messages.forEach((message) => {
      if (message.role === 'user') {
        // Start a new group
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          id: message.id,
          userMessage: message,
          modelResponses: []
        };
      } else if (message.role === 'assistant' && currentGroup) {
        // Add model response to current group
        currentGroup.modelResponses.push(message);
      }
    });

    // Add the last group if it exists
    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);

  const getModelName = (modelId: string) => {
    const settings = SettingsService.getSettings();
    const remoteModel = getModelById(modelId);
    const localModel = settings.localModels.find(local => local.id === modelId);

    if (remoteModel) return remoteModel.name;
    if (localModel) return localModel.name;
    return modelId;
  };

  const getModelProvider = (modelId: string) => {
    const settings = SettingsService.getSettings();
    const remoteModel = getModelById(modelId);
    const localModel = settings.localModels.find(local => local.id === modelId);

    if (remoteModel) return remoteModel.provider;
    if (localModel) return 'Local';
    return 'Unknown';
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Welcome to Multi-Model Chat
          </h3>
          <p className="text-gray-600 max-w-md">
            Select one or more AI models above and start a conversation. You'll be able to compare responses from different models side by side.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-8"
    >
      {groupedMessages.map((group) => (
        <div key={group.id} className="space-y-4">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-2xl">
              <div className="text-gray-700 whitespace-pre-wrap bg-primary-600 text-white rounded-lg px-4 py-3">
                {group.userMessage.content}
              </div>
              <div className="text-xs text-gray-500 mt-2 text-right">
                {group.userMessage.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Model responses comparison table */}
          {group.modelResponses.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
                  {group.modelResponses.map((response) => (
                    <div key={response.model} className="p-4 border-r border-gray-200 last:border-r-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {getModelName(response.model || '')}
                        </h4>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {getModelProvider(response.model || '')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {response.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
                {group.modelResponses.map((response) => (
                  <div key={response.model} className="p-4 border-r border-gray-200 last:border-r-0 min-h-[200px]">
                    {response.isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                          <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    ) : response.error ? (
                      <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
                        Error: {response.error}
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ChatMessage message={response} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading state when waiting for responses */}
          {group.modelResponses.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <span className="text-sm text-gray-500">Waiting for model responses...</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

