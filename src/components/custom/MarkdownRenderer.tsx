import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";

// Interface for component props
interface IsolatedMarkdownRendererProps {
  children: string;
  syntaxHighlighterTheme?: any; // Theme from react-syntax-highlighter
}

// Type for style objects
type StyleMap = Record<string, React.CSSProperties>;

/**
 * A Markdown renderer component that isolates its styling from Moodle's CSS
 * and supports mathematics (KaTeX), syntax highlighting (Prism), tables,
 * and a copy button for code blocks.
 */
const IsolatedMarkdownRenderer: React.FC<IsolatedMarkdownRendererProps> = ({
  children,
  syntaxHighlighterTheme = vscDarkPlus,
}) => {
  // Style object to isolate our component from Moodle's CSS
  const containerStyle: React.CSSProperties = {
    // Create a new stacking context
    position: "relative",
    zIndex: 1,
    // Box model reset
    boxSizing: "border-box",
    margin: "0",
    padding: "20px",
    // Visual styling
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "16px",
    lineHeight: 1.5,
    color: "#333",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    // Ensure our styling takes precedence
    all: "initial", // Modern browsers will reset all properties
  };

  // Styles for each markdown element - using inline styles to avoid CSS conflicts
  const markdownStyles: StyleMap = {
    h1: {
      fontSize: "2em",
      fontWeight: "bold",
      margin: "0.67em 0",
      color: "#333",
    },
    h2: {
      fontSize: "1.5em",
      fontWeight: "bold",
      margin: "0.83em 0",
      color: "#333",
    },
    h3: {
      fontSize: "1.17em",
      fontWeight: "bold",
      margin: "1em 0",
      color: "#333",
    },
    p: { margin: "1em 0", color: "#333" },
    a: { color: "#0366d6", textDecoration: "none" },
    strong: { fontWeight: "bold" },
    em: { fontStyle: "italic" },
    ul: { paddingLeft: "2em", margin: "1em 0" },
    ol: { paddingLeft: "2em", margin: "1em 0" },
    li: { margin: "0.5em 0" },
    code: {
      fontFamily: "monospace",
      backgroundColor: "#f6f8fa",
      padding: "0.2em 0.4em",
      borderRadius: "3px",
      color: "#304ba1",
    },
    pre: {
      margin: "1em 0",
      padding: 0,
      overflow: "visible",
    },
    blockquote: {
      borderLeft: "4px solid #ddd",
      padding: "0 1em",
      color: "#666",
    },
    img: { maxWidth: "100%" },
    // Enhanced table styling
    table: {
      borderCollapse: "collapse",
      width: "100%",
      margin: "1em 0",
      display: "table", // Explicitly set display property
      tableLayout: "fixed", // Prevents table from breaking layout
    },
    thead: {
      display: "table-header-group",
      verticalAlign: "middle",
      borderColor: "inherit",
    },
    tbody: {
      display: "table-row-group",
      verticalAlign: "middle",
      borderColor: "inherit",
    },
    tr: {
      display: "table-row",
      verticalAlign: "inherit",
      borderColor: "inherit",
    },
    th: {
      border: "1px solid #ddd",
      padding: "8px",
      backgroundColor: "#f6f8fa",
      textAlign: "left",
      fontWeight: "bold",
      display: "table-cell",
    },
    td: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
      display: "table-cell",
    },
  };

  // Type for component props that ReactMarkdown components receive
  type ComponentProps = {
    node: any;
    [key: string]: any;
  };

  // Copy code button component
  const CopyButton: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
    };

    return (
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          padding: "5px 8px",
          fontSize: "12px",
          backgroundColor: copied ? "#4caf50" : "#f5f5f5",
          color: copied ? "white" : "#333",
          borderRadius: "4px",
          cursor: "pointer",
          opacity: 0.8,
          transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
          zIndex: 10,
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    );
  };

  // Code block wrapper component with hover effect
  const CodeBlockWrapper: React.FC<{
    children: React.ReactNode;
    code: string;
  }> = ({ children, code }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          borderRadius: "3px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && <CopyButton code={code} />}
        {children}
      </div>
    );
  };

  // Creates component renderers with scoped styles
  const components: Record<string, React.FC<ComponentProps>> = {};

  Object.keys(markdownStyles).forEach((key) => {
    if (key === "code") {
      // Special handling for code blocks (with syntax highlighting and copy button)
      components.code = ({
        node,
        inline,
        className,
        children,
        ...props
      }: any) => {
        const match = /language-(\w+)/.exec(className || "");
        const language = match && match[1] ? match[1] : "";
        const code = String(children).replace(/\n$/, "");

        if (!inline && language) {
          return (
            <CodeBlockWrapper code={code}>
              <SyntaxHighlighter
                style={syntaxHighlighterTheme}
                language={language}
                PreTag="div"
                customStyle={{ margin: "1em 0", borderRadius: "3px" }}
                {...props}
              >
                {code}
              </SyntaxHighlighter>
            </CodeBlockWrapper>
          );
        } else {
          return (
            <code style={markdownStyles.code} className={className} {...props}>
              {children}
            </code>
          );
        }
      };
    } else {
      components[key] = ({ node, ...props }: ComponentProps) => {
        const Element = key as keyof JSX.IntrinsicElements;
        return <Element style={markdownStyles[key]} {...props} />;
      };
    }
  });

  return (
    <div style={containerStyle}>
      <div
        className="markdown-content"
        style={{ all: "revert", fontFamily: "Arial", padding: "0rem" }}
      >
        <ReactMarkdown
          components={components}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {children}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default IsolatedMarkdownRenderer;
