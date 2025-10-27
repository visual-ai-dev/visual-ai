'use client';

import { useState } from 'react';
import { GlobeIcon, SparklesIcon } from 'lucide-react';
import {
  PromptInput,
  PromptInputBody,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputSpeechButton,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputSubmit,
  usePromptInputController,
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageAvatar,
} from '@/components/ai-elements/message';

// Mock responses for simulating AI conversation
const MOCK_RESPONSES = [
  "I understand you're looking for help. Could you provide more details about what you need?",
  "That's an interesting question! Let me break this down for you...",
  "Based on what you've shared, here's what I would suggest:",
  "Great question! The key thing to understand here is...",
  "I can help with that. Here's a detailed explanation:",
  "Let me provide you with a comprehensive answer to your query.",
];

export function ChatPanel() {
  const controller = usePromptInputController();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [model, setModel] = useState('gpt-4o');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = () => {
    const inputText = controller.textInput.value;
    if (!inputText.trim()) return;

    // Add user message
    setMessages([...messages, { role: 'user', content: inputText }]);
    setIsTyping(true);

    // Simulate assistant typing and response
    setTimeout(() => {
      const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Chat
        </h2>
      </div>

      {/* Messages using Conversation component */}
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<SparklesIcon className="size-8" />}
              title="Start a conversation"
              description="Ask me anything or share your thoughts"
            />
          ) : (
            <>
              {messages.map((message, index) => (
                <Message key={index} from={message.role}>
                  <MessageAvatar
                    src={
                      message.role === 'user'
                        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
                        : 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant'
                    }
                    name={message.role === 'user' ? 'User' : 'AI'}
                  />
                  <MessageContent variant="contained">
                    {message.content}
                  </MessageContent>
                </Message>
              ))}
              {isTyping && (
                <Message from="assistant">
                  <MessageAvatar
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=assistant"
                    name="AI"
                  />
                  <MessageContent variant="contained">
                    <div className="flex items-center gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce animation-delay-200">●</span>
                      <span className="animate-bounce animation-delay-400">●</span>
                    </div>
                  </MessageContent>
                </Message>
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <PromptInput onSubmit={handleSubmit} className="relative">
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => (
                <PromptInputAttachment data={attachment} />
              )}
            </PromptInputAttachments>
            <PromptInputTextarea
              placeholder="Type your message..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSpeechButton />
              <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputModelSelect onValueChange={setModel} value={model}>
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  <PromptInputModelSelectItem value="gpt-4o">
                    GPT-4o
                  </PromptInputModelSelectItem>
                  <PromptInputModelSelectItem value="claude-opus-4-20250514">
                    Claude 4 Opus
                  </PromptInputModelSelectItem>
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={!controller.textInput.value.trim() || isTyping}
              status={isTyping ? 'loading' : controller.textInput.value.trim() ? 'ready' : 'idle'}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
