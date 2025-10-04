"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface MathContentRendererProps {
  content: string;
  className?: string;
}

export function MathContentRenderer({
  content,
  className,
}: MathContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    const renderContent = () => {
      if (!containerRef.current) return;

      try {
        // First decode HTML entities to get the raw content
        const decodedContent = content
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, "\u00A0"); // Convert &nbsp; to actual non-breaking space character

        // Process the decoded content to replace math expressions with rendered HTML
        let processedContent = decodedContent;

        // Handle display math ($$...$$)
        processedContent = processedContent.replace(
          /\$\$(.*?)\$\$/g,
          (match, mathExpression) => {
            const trimmedExpression = mathExpression.trim();

            if (!trimmedExpression) {
              return match; // Return original if empty
            }

            try {
              const rendered = katex.renderToString(trimmedExpression, {
                displayMode: true,
                throwOnError: false,
                strict: false,
                trust: true,
              });

              return `<div class="katex-display-wrapper" style="text-align: center; margin: 1rem 0;">${rendered}</div>`;
            } catch (error) {
              console.error(
                "KaTeX display math rendering error:",
                error,
                "Expression:",
                trimmedExpression
              );
              return `<span class="math-error" style="background-color: #fef2f2; color: #dc2626; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">Display Math Error: ${match}</span>`;
            }
          }
        );

        // Handle inline math ($...$) - but avoid matching already processed display math
        processedContent = processedContent.replace(
          /(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)/g,
          (match, mathExpression) => {
            const trimmedExpression = mathExpression.trim();

            if (!trimmedExpression) {
              return match; // Return original if empty
            }

            try {
              const rendered = katex.renderToString(trimmedExpression, {
                displayMode: false, // Inline mode
                throwOnError: false,
                strict: false,
                trust: true,
              });

              return `<span class="katex-inline-wrapper">${rendered}</span>`;
            } catch (error) {
              console.error(
                "KaTeX inline math rendering error:",
                error,
                "Expression:",
                trimmedExpression
              );
              return `<span class="math-error" style="background-color: #fef2f2; color: #dc2626; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">Inline Math Error: ${match}</span>`;
            }
          }
        );

        // Set the processed HTML content
        containerRef.current.innerHTML = processedContent;
      } catch (error) {
        console.error("Content processing error:", error);
        // Fallback to original content
        containerRef.current.innerHTML = content;
      }
    };

    renderContent();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "math-content prose max-w-none",
        // Custom styles for math rendering
        "[&_.katex-display-wrapper]:my-4 [&_.katex-display-wrapper]:text-center",
        "[&_.katex-display]:m-0",
        "[&_.katex-inline-wrapper]:inline",
        "[&_.math-error]:bg-red-50 [&_.math-error]:text-red-600 [&_.math-error]:px-2 [&_.math-error]:py-1 [&_.math-error]:rounded [&_.math-error]:text-sm",
        className
      )}
      style={{
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
    />
  );
}
