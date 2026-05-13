'use client';

import { useTransition } from 'react';
import { Button } from '@streaming/ui';
import { deleteSong } from '../../lib/actions/song';

export function DeleteSongButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`정말 "${title}"을(를) 삭제할까요?`)) return;
        start(async () => {
          await deleteSong(id);
        });
      }}
    >
      {pending ? '삭제중...' : '삭제'}
    </Button>
  );
}
