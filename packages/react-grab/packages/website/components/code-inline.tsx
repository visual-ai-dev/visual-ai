import { highlightCodeSimple } from '@/lib/shiki';

interface CodeInlineProps {
  code: string;
  lang?: string;
  theme?: 'vesper';
  className?: string;
}

export async function CodeInline({
  code,
  lang = 'typescript',
  theme = 'vesper',
  className = '',
}: CodeInlineProps) {
  const html = await highlightCodeSimple(code.trim(), lang, theme);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
