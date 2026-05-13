'use client';

import { useTransition } from 'react';
import { Button } from '@streaming/ui';
import { deleteAnnouncement } from '../../lib/actions/announcement';

export function DeleteAnnouncementButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`"${title}" 공지를 삭제할까요?`)) return;
        start(async () => {
          await deleteAnnouncement(id);
        });
      }}
    >
      {pending ? '삭제중...' : '삭제'}
    </Button>
  );
}
