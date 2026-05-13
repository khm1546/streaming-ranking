import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@streaming/ui';
import { createSong } from '../../../lib/actions/song';

export const metadata = { title: '새 곡 등록 — Admin' };

export default function NewSongPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">새 곡 등록</h1>
        <Link href="/songs" className="text-sm text-text-muted hover:text-brand-600">
          ← 목록
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>곡 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSong} className="space-y-4">
            <Field label="제목" required>
              <Input name="title" required maxLength={200} placeholder="Heavy Serenade" />
            </Field>
            <Field label="아티스트" required>
              <Input name="artist" required maxLength={200} placeholder="NMIXX" />
            </Field>
            <Field
              label="별칭 (쉼표로 구분)"
              hint="OCR 매칭에 사용됩니다. 예: Heavy Serenade, 헤비 세레나데, HS"
            >
              <Input name="aliases" placeholder="별칭1, 별칭2, 별칭3" />
            </Field>
            <Field label="앨범 커버 URL (선택)">
              <Input name="albumCoverUrl" type="url" placeholder="https://..." />
            </Field>
            <Field label="발매일 (선택)">
              <Input name="releaseDate" type="date" />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" defaultChecked />
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
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-text-muted">{hint}</span> : null}
    </label>
  );
}
