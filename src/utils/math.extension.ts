import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import katex from "katex";

export interface MathOptions {
  inlineMathDelimiter: [string, string];
  displayMathDelimiter: [string, string];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    math: {
      setMath: (content: string) => ReturnType;
    };
  }
}

export const MathExtension = Extension.create<MathOptions>({
  name: "math",

  addOptions() {
    return {
      inlineMathDelimiter: ["$", "$"],
      displayMathDelimiter: ["$$", "$$"],
    };
  },

  addCommands() {
    return {
      setMath:
        (content: string) =>
        ({ commands }) => {
          return commands.insertContent(content);
        },
    };
  },

  addProseMirrorPlugins() {
    const { inlineMathDelimiter, displayMathDelimiter } = this.options;

    return [
      new Plugin({
        key: new PluginKey("math"),
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            const [inlineStart, inlineEnd] = inlineMathDelimiter;
            const [displayStart, displayEnd] = displayMathDelimiter;

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || "";
                let match: RegExpExecArray | null;

                // Match inline math
                const inlineRegex = new RegExp(
                  `${escapeRegExp(inlineStart)}(.*?)${escapeRegExp(inlineEnd)}`,
                  "g"
                );
                while ((match = inlineRegex.exec(text)) !== null) {
                  const start = pos + match.index;
                  const end = start + match[0].length;
                  const math = match[1];
                  const originalText = match[0];

                  try {
                    const rendered = katex.renderToString(math, {
                      displayMode: false,
                      throwOnError: false,
                    });

                    // Replace the entire math expression with a single widget
                    decorations.push(
                      Decoration.widget(start, () => {
                        const span = document.createElement("span");
                        span.innerHTML = rendered;
                        span.className = "math-inline";
                        span.setAttribute("data-math", originalText); // Store original text for editing
                        return span;
                      })
                    );

                    // Mark the original text to be hidden
                    decorations.push(
                      Decoration.inline(start, end, {
                        class: "math-inline-hidden",
                      })
                    );
                  } catch (error) {
                    console.error("KaTeX rendering error:", error);
                  }
                }

                // Match display math
                const displayRegex = new RegExp(
                  `${escapeRegExp(displayStart)}(.*?)${escapeRegExp(
                    displayEnd
                  )}`,
                  "g"
                );
                while ((match = displayRegex.exec(text)) !== null) {
                  const start = pos + match.index;
                  const end = start + match[0].length;
                  const math = match[1];
                  const originalText = match[0];

                  try {
                    const rendered = katex.renderToString(math, {
                      displayMode: true,
                      throwOnError: false,
                    });

                    // Replace the entire math expression with a single widget
                    decorations.push(
                      Decoration.widget(start, () => {
                        const div = document.createElement("div");
                        div.innerHTML = rendered;
                        div.className = "math-display";
                        div.setAttribute("data-math", originalText); // Store original text for editing
                        return div;
                      })
                    );

                    // Mark the original text to be hidden
                    decorations.push(
                      Decoration.inline(start, end, {
                        class: "math-display-hidden",
                      })
                    );
                  } catch (error) {
                    console.error("KaTeX rendering error:", error);
                  }
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
