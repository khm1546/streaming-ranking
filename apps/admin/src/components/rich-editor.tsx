'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface RichEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function RichEditor({
  value = '',
  onChange,
  placeholder = '내용을 입력하세요...',
  editable = true,
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[240px] rounded-md border border-surface-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {editable ? <EditorToolbar editor={editor} /> : null}
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    `h-8 px-2 rounded text-sm font-medium ${
      active ? 'bg-brand-600 text-white' : 'bg-surface-muted text-text hover:bg-surface-border'
    }`;

  return (
    <div className="flex flex-wrap gap-1">
      <button
        type="button"
        className={btn(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        굵게
      </button>
      <button
        type="button"
        className={btn(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        기울임
      </button>
      <button
        type="button"
        className={btn(editor.isActive('heading', { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        제목
      </button>
      <button
        type="button"
        className={btn(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        목록
      </button>
      <button
        type="button"
        className={btn(editor.isActive('orderedList'))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        번호목록
      </button>
      <button
        type="button"
        className={btn(editor.isActive('blockquote'))}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        인용
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={() => {
          const url = window.prompt('링크 URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        링크
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={() => editor.chain().focus().undo().run()}
      >
        실행취소
      </button>
    </div>
  );
}
