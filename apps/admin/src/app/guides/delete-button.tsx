'use client';

import { useTransition } from 'react';
import { Button } from '@streaming/ui';
import { deleteGuide } from '../../lib/actions/guide';

export function DeleteGuideButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`"${title}" 가이드를 삭제할까요?`)) return;
        start(async () => {
          await deleteGuide(id);
        });
      }}
    >
      {pending ? '삭제중...' : '삭제'}
    </Button>
  );
}
