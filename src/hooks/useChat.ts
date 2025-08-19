import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { ApiService } from '../services/api';
import { SettingsService } from '../services/settings';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || selectedModels.length === 0) return;

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);

    const settings = SettingsService.getSettings();
    const enabledLocalModels = settings.localModels.filter(model => model.isEnabled);

    // Separate remote and local models
    const remoteModels = selectedModels.filter(modelId =>
      !enabledLocalModels.some(local => local.id === modelId)
    );
    const localModels = enabledLocalModels.filter(model =>
      selectedModels.includes(model.id)
    );

    console.log('Selected models:', selectedModels);
    console.log('Remote models to query:', remoteModels);
    console.log('Local models to query:', localModels.map(m => m.name));

    // Create loading messages only for selected models
    const loadingMessages: ChatMessage[] = selectedModels.map((modelId, index) => ({
      id: `loading-${modelId}-${Date.now()}-${index}`,
      content: '',
      role: 'assistant',
      model: modelId,
      timestamp: new Date(),
      isLoading: true,
    }));

    setMessages(prev => [...prev, ...loadingMessages]);
    setIsLoading(true);

    try {
      const updatePromises: Promise<void>[] = [];

      // Handle remote models individually
      remoteModels.forEach(modelId => {
        const loadingMessage = loadingMessages.find(msg => msg.model === modelId);
        if (!loadingMessage) return;

        // Create a promise for this single model's update
        const promise = ApiService.queryModels(content, [modelId]) // Query one model
          .then(responses => {
            // ApiService returns an array, even for one model
            const response = responses[0];
            if (response) {
              console.log('Received remote response for:', response.model);
              updateMessage(loadingMessage.id, {
                content: response.content,
                isLoading: false,
                error: response.error,
              });
            }
          })
          .catch(error => {
            console.error(`Failed remote request for ${modelId}:`, error);
            updateMessage(loadingMessage.id, {
              isLoading: false,
              error: 'Failed to get response',
            });
          });

        updatePromises.push(promise);
      });

      // Handle local models individually
      localModels.forEach(model => {
        const loadingMessage = loadingMessages.find(msg => msg.model === model.id);
        if (!loadingMessage) return;

        // Create a promise for this single model's update
        const promise = ApiService.queryLocalModels(content, [model]) // Query one model
          .then(responses => {
            const response = responses[0];
            if (response) {
              console.log('Received local response for:', response.model);
              updateMessage(loadingMessage.id, {
                content: response.content,
                isLoading: false,
                error: response.error,
              });
            }
          })
          .catch(error => {
            console.error(`Failed local request for ${model.name}:`, error);
            updateMessage(loadingMessage.id, {
              isLoading: false,
              error: 'Failed to get response',
            });
          });

        updatePromises.push(promise);
      });

      await Promise.all(updatePromises);

    } catch (error) {
      console.error('Unexpected error in sendMessage:', error);

      // Update ALL loading messages with error
      loadingMessages.forEach(loadingMessage => {
        updateMessage(loadingMessage.id, {
          content: '',
          isLoading: false,
          error: 'Unexpected error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        });
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedModels, addMessage, updateMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setModels = useCallback((modelIds: string[]) => {
    setSelectedModels(modelIds);
  }, []);

  return {
    messages,
    selectedModels,
    isLoading,
    sendMessage,
    clearMessages,
    setModels,
  };
};
