"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { MathExtension } from "@/utils/math.extension";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      MathExtension.configure({
        inlineMathDelimiter: ["$", "$"],
        displayMathDelimiter: ["$$", "$$"],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Convert non-breaking space characters back to &nbsp; entities for storage
      const processedHtml = html.replace(/\u00A0/g, '&nbsp;');
      onChange(processedHtml);
    },
    editorProps: {
      transformPastedHTML: (html) => {
        // Prevent automatic HTML entity encoding on paste and preserve nbsp
        return html;
      },
      transformPastedText: (text) => {
        // Convert leading spaces to non-breaking spaces
        return text.replace(/^( +)/gm, (match) => {
          return match.replace(/ /g, '\u00A0'); // Convert to actual non-breaking space character
        });
      },
      attributes: {
        style: "white-space: pre-wrap;", // Preserve whitespace and line breaks
      },
      handleDOMEvents: {
        beforeinput: (view, event) => {
          // Handle space insertion to preserve leading spaces
          if (event.inputType === 'insertText' && event.data === ' ') {
            const { from, to } = view.state.selection;
            const $from = view.state.doc.resolve(from);
            const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
            
            // If we're at the beginning of a line or after only spaces, use non-breaking space
            if (textBefore === '' || /^ +$/.test(textBefore)) {
              event.preventDefault();
              view.dispatch(view.state.tr.insertText('\u00A0', from, to));
              return true;
            }
          }
          return false;
        },
      },
    },
    parseOptions: {
      preserveWhitespace: true, // Preserve whitespace in content
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      // Use a more careful content setting to avoid encoding issues
      const currentContent = editor.getHTML();
      const trimmedValue = (value || "").trim();
      const trimmedCurrent = currentContent.trim();

      // Only update if content is actually different
      if (trimmedValue !== trimmedCurrent && trimmedValue !== "") {
        // Convert &nbsp; entities to actual non-breaking space characters before setting content
        const processedValue = value.replace(/&nbsp;/g, '\u00A0');
        editor.commands.setContent(processedValue || "", false);
      }
    }
  }, [value, editor]);

  return (
    <div
      className={cn(
        "min-h-[150px] rounded-md border border-input bg-background px-3 py-2",
        className
      )}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .ProseMirror {
            white-space: pre-wrap !important;
            word-wrap: break-word;
          }
          .ProseMirror p {
            margin: 0;
            white-space: pre-wrap !important;
          }
          .ProseMirror .math-inline-hidden,
          .ProseMirror .math-display-hidden {
            display: none;
          }
        `
      }} />
      <EditorContent editor={editor} />
    </div>
  );
}
