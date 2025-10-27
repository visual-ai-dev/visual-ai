'use client';

import { ChatPanel } from '@/components/chat-panel';
import { WebPreviewPanel } from '@/components/web-preview-panel';
import { PromptInputProvider, usePromptInputController } from '@/components/ai-elements/prompt-input';
import { useEffect } from 'react';

interface StackItem {
  componentName: string;
  displayName?: string;
  fileName?: string;
  source?: string;
}

interface ReactGrabResult {
  type: 'react-grab-result';
  data: {
    htmlSnippet: string;
    componentStack: StackItem[] | null;
    serializedStack: string | null;
    fullText: string;
    tagName: string;
    timestamp: number;
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

function PageContent() {
  const controller = usePromptInputController();

  useEffect(() => {
    const handleMessage = (event: MessageEvent<ReactGrabResult>) => {
      // Optional: Validate origin in production
      // if (event.origin !== 'http://localhost:3001') return;

      if (event.data?.type === 'react-grab-result') {
        const { data } = event.data;

        // Format the grabbed element data
        const formattedText = `I grabbed this element from the page:

Tag: <${data.tagName}>
${data.serializedStack ? `\nComponent Stack:\n${data.serializedStack}\n` : ''}
HTML Snippet:
${data.htmlSnippet}

Position: x=${data.rect.x.toFixed(2)}px, y=${data.rect.y.toFixed(2)}px
Size: ${data.rect.width.toFixed(2)}px × ${data.rect.height.toFixed(2)}px

Please help me understand or modify this element.`;

        // Set the text in the prompt input
        controller.textInput.setInput(formattedText);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [controller]);

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      {/* Left Column - Chat (1/3 of web preview width) */}
      <div className="w-1/4 border-r border-zinc-200 dark:border-zinc-800">
        <ChatPanel />
      </div>

      {/* Right Column - Web Preview */}
      <div className="w-3/4">
        <WebPreviewPanel />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PromptInputProvider initialInput="">
      <PageContent />
    </PromptInputProvider>
  );
}
