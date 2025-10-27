import { highlightCode } from '@/lib/shiki';

interface CodeProps {
  code: string;
  lang: string;
  theme?: 'vesper';
  showLineNumbers?: boolean;
  className?: string;
}

export async function Code({
  code,
  lang,
  theme = 'vesper',
  showLineNumbers = false,
  className = '',
}: CodeProps) {
  const html = await highlightCode({
    code: code.trim(),
    lang,
    theme,
    showLineNumbers,
  });

  return (
    <div
      className={`bg-black ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
