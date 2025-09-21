import React from 'react';

function ChatMessage({ message, isUser, timestamp, isTyping = false }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-primary-500 text-white' 
          : 'bg-white border border-beige-200 text-secondary-800'
      }`}>
        {isTyping ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <p className="text-sm">{message}</p>
        )}
        {timestamp && (
          <p className={`text-xs mt-1 ${
            isUser ? 'text-primary-100' : 'text-gray-500'
          }`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
