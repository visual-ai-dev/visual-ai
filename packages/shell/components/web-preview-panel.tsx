'use client';

import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewConsole,
} from '@/components/ai-elements/web-preview';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  Maximize2Icon,
  MousePointerClickIcon,
  RefreshCcwIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useWebPreview } from '@/components/ai-elements/web-preview';

const exampleLogs = [
  {
    level: 'log' as const,
    message: 'Page loaded successfully',
    timestamp: new Date(Date.now() - 10000),
  },
  {
    level: 'warn' as const,
    message: 'Deprecated API usage detected',
    timestamp: new Date(Date.now() - 5000),
  },
  {
    level: 'error' as const,
    message: 'Failed to load resource',
    timestamp: new Date(),
  },
];

function WebPreviewNavigationContent() {
  const { sendMessage } = useWebPreview();
  const [fullscreen, setFullscreen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  const handleSelectClick = () => {
    const newSelectMode = !selectMode;
    setSelectMode(newSelectMode);

    // Send react-grab message to iframe
    sendMessage({
      type: 'react-grab',
      action: 'toggle',
    });
  };

  return (
    <>
      <WebPreviewNavigationButton
        tooltip="Go back"
        onClick={() => console.log('Go back')}
      >
        <ArrowLeftIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewNavigationButton
        tooltip="Go forward"
        onClick={() => console.log('Go forward')}
      >
        <ArrowRightIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewNavigationButton
        tooltip="Reload"
        onClick={() => console.log('Reload')}
      >
        <RefreshCcwIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewUrl />
      <WebPreviewNavigationButton
        tooltip="Select"
        onClick={handleSelectClick}
        className={selectMode ? 'bg-accent' : ''}
      >
        <MousePointerClickIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewNavigationButton
        tooltip="Open in new tab"
        onClick={() => console.log('Open in new tab')}
      >
        <ExternalLinkIcon className="size-4" />
      </WebPreviewNavigationButton>
      <WebPreviewNavigationButton
        tooltip="Maximize"
        onClick={() => setFullscreen(!fullscreen)}
      >
        <Maximize2Icon className="size-4" />
      </WebPreviewNavigationButton>
    </>
  );
}

export function WebPreviewPanel() {
  return (
    <div className="h-full pl-2 pt-2 pb-2 pr-1">
      <WebPreview
        defaultUrl="/"
        onUrlChange={(url) => console.log('URL changed to:', url)}
        className="h-full"
      >
        <WebPreviewNavigation>
          <WebPreviewNavigationContent />
        </WebPreviewNavigation>

        <WebPreviewBody src="http://localhost:3001" />

        <WebPreviewConsole logs={exampleLogs} />
      </WebPreview>
    </div>
  );
}
