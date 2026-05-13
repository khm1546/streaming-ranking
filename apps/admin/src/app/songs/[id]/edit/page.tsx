import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@streaming/ui';
import { prisma } from '@streaming/db';
import { updateSong } from '../../../../lib/actions/song';

export const metadata = { title: '곡 수정 — Admin' };

export default async function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const song = await prisma.song.findUnique({ where: { id } });
  if (!song) notFound();

  const action = updateSong.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">곡 수정</h1>
        <Link href="/songs" className="text-sm text-text-muted hover:text-brand-600">
          ← 목록
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{song.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <Field label="제목" required>
              <Input name="title" required defaultValue={song.title} maxLength={200} />
            </Field>
            <Field label="아티스트" required>
              <Input name="artist" required defaultValue={song.artist} maxLength={200} />
            </Field>
            <Field label="별칭 (쉼표로 구분)">
              <Input name="aliases" defaultValue={song.aliases.join(', ')} />
            </Field>
            <Field label="앨범 커버 URL">
              <Input
                name="albumCoverUrl"
                type="url"
                defaultValue={song.albumCoverUrl ?? ''}
                placeholder="https://..."
              />
            </Field>
            <Field label="발매일">
              <Input
                name="releaseDate"
                type="date"
                defaultValue={song.releaseDate ? song.releaseDate.toISOString().slice(0, 10) : ''}
              />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" defaultChecked={song.isActive} />
              순위에 노출
            </label>
            <div className="flex gap-2 pt-2">
              <Button type="submit">저장</Button>
              <Link href="/songs">
                <Button type="button" variant="secondary">
                  취소
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}
