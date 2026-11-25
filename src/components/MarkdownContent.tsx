import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  body: string | null
}

export function MarkdownContent({ body }: MarkdownContentProps) {
  if (!body) {
    return <p className="text-text text-[16px] leading-[1.6]">Este post não possui conteúdo.</p>
  }

  return (
    <div className="prose prose-invert max-w-none prose-p:text-text prose-p:text-[16px] prose-p:leading-[1.6] prose-headings:text-title prose-a:text-brand prose-a:underline prose-strong:text-title prose-code:text-code-plain prose-pre:bg-post prose-pre:rounded-code prose-pre:p-4 prose-pre:overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
