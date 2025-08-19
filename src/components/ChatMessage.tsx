import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LoadingDots } from './LoadingDots';


interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {

  return (
    <div className="space-y-3">
      {/* Message content */}
      {message.isLoading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <LoadingDots size="sm" />
          <span className="text-sm">Thinking...</span>
        </div>
      ) : message.error ? (
        <div className="text-red-600 text-sm">
          Error: {message.error}
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          <MarkdownRenderer content={message.content} />
        </div>
      )}
    </div>
  );
};

