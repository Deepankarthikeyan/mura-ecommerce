"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";
import type { Editor } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";

export type ProductDescriptionRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

const toolbarBtn: CSSProperties = {
  boxSizing: "border-box",
  width: "auto",
  maxWidth: "max-content",
  flex: "0 0 auto",
  minHeight: 26,
  height: 26,
  padding: "0 7px",
  borderRadius: 4,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  lineHeight: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const toolbarBtnActive: CSSProperties = {
  ...toolbarBtn,
  background: "#e5e7eb",
  borderColor: "#9ca3af",
};

function Toolbar({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  if (!editor || disabled) return null;

  const is = (
    nameOrAttrs: string | Record<string, unknown>,
    attrs?: Record<string, unknown>,
  ) =>
    typeof nameOrAttrs === "string"
      ? attrs
        ? editor.isActive(nameOrAttrs, attrs)
        : editor.isActive(nameOrAttrs)
      : editor.isActive(nameOrAttrs);

  const run = (fn: () => boolean) => {
    if (!disabled) fn();
  };

  return (
    <div
      className="tiptap-toolbar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        flex: "0 0 auto",
        alignContent: "flex-start",
        alignItems: "center",
        gap: 4,
        padding: "6px 8px",
        borderBottom: "1px solid #d1d5db",
        background: "#fafafa",
        borderRadius: "6px 6px 0 0",
      }}
    >
      <select
        aria-label="Heading"
        style={{
          ...toolbarBtn,
          width: "auto",
          maxWidth: 118,
          height: 26,
          minHeight: 26,
          padding: "0 4px 0 6px",
          fontSize: 11,
          cursor: "pointer",
        }}
        value={
          is("heading", { level: 1 })
            ? "h1"
            : is("heading", { level: 2 })
              ? "h2"
              : is("heading", { level: 3 })
                ? "h3"
                : "p"
        }
        onChange={(e) => {
          const v = e.target.value;
          run(() => {
            if (v === "p") editor.chain().focus().setParagraph().run();
            else if (v === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (v === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
          });
        }}
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <button
        type="button"
        style={is("bold") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleBold().run())}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        style={is("italic") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleItalic().run())}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        style={is("underline") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}
        title="Underline"
      >
        <u>U</u>
      </button>
      <button
        type="button"
        style={is("strike") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleStrike().run())}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        type="button"
        style={is({ textAlign: "left" }) ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().setTextAlign("left").run())}
        title="Align left"
      >
        ⫷
      </button>
      <button
        type="button"
        style={is({ textAlign: "center" }) ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().setTextAlign("center").run())}
        title="Align center"
      >
        ☰
      </button>
      <button
        type="button"
        style={is({ textAlign: "right" }) ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().setTextAlign("right").run())}
        title="Align right"
      >
        ⫸
      </button>
      <button
        type="button"
        style={is("bulletList") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}
        title="Bullet list"
      >
        • List
      </button>
      <button
        type="button"
        style={is("orderedList") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}
        title="Numbered list"
      >
        1. List
      </button>
      <button
        type="button"
        style={is("blockquote") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleBlockquote().run())}
        title="Quote"
      >
        “ ”
      </button>
      <button
        type="button"
        style={is("codeBlock") ? toolbarBtnActive : toolbarBtn}
        onClick={() => run(() => editor.chain().focus().toggleCodeBlock().run())}
        title="Code block"
      >
        {"</>"}
      </button>
      <button
        type="button"
        style={is("link") ? toolbarBtnActive : toolbarBtn}
        onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = typeof window !== "undefined" ? window.prompt("Link URL", prev ?? "https://") : null;
          if (url === null) return;
          if (url === "") {
            run(() => editor.chain().focus().extendMarkRange("link").unsetLink().run());
            return;
          }
          run(() => editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run());
        }}
        title="Link"
      >
        Link
      </button>
      <label
        style={{
          ...toolbarBtn,
          display: "inline-flex",
          width: "auto",
          maxWidth: "max-content",
          height: 26,
          minHeight: 26,
          alignItems: "center",
          gap: 4,
          paddingInline: 6,
        }}
      >
        <span style={{ fontSize: 10, color: "#6b7280", lineHeight: 1, flexShrink: 0 }}>Text</span>
        <input
          type="color"
          aria-label="Text color"
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            padding: 0,
            border: "none",
            cursor: "pointer",
          }}
          value={editor.getAttributes("textStyle").color || "#000000"}
          onChange={(e) => run(() => editor.chain().focus().setColor(e.target.value).run())}
        />
      </label>
      <label
        style={{
          ...toolbarBtn,
          display: "inline-flex",
          width: "auto",
          maxWidth: "max-content",
          height: 26,
          minHeight: 26,
          alignItems: "center",
          gap: 4,
          paddingInline: 6,
        }}
      >
        <span style={{ fontSize: 10, color: "#6b7280", lineHeight: 1, flexShrink: 0 }}>Hi</span>
        <input
          type="color"
          aria-label="Highlight"
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            padding: 0,
            border: "none",
            cursor: "pointer",
          }}
          defaultValue="#ffff00"
          onChange={(e) =>
            run(() => editor.chain().focus().toggleHighlight({ color: e.target.value }).run())
          }
        />
      </label>
      <button
        type="button"
        style={toolbarBtn}
        onClick={() => run(() => editor.chain().focus().unsetAllMarks().clearNodes().run())}
        title="Clear formatting"
      >
        Clear
      </button>
    </div>
  );
}

/** Rich-text description for staff inventory (HTML in Mongo `description`). React 19–safe (no findDOMNode). */
export default function ProductDescriptionRichEditor({
  value,
  onChange,
  disabled,
}: ProductDescriptionRichEditorProps) {
  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          link: { openOnClick: false },
        }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
      ],
      content: value || "",
      editable: !disabled,
      onUpdate: ({ editor: ed }) => {
        onChange(ed.getHTML());
      },
    },
    []
  );

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const next = value || "";
    const cur = editor.getHTML();
    if (cur === next) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [value, editor]);

  return (
    <div
      className="product-description-tiptap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        overflow: "hidden",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      <Toolbar editor={editor} disabled={!!disabled} />
      <EditorContent editor={editor} className="tiptap-editor-inner" />
    </div>
  );
}
