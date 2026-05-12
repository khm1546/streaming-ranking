import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '로그인 — 스밍 랭킹' };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold">로그인</h1>
      <Card>
        <CardHeader>
          <CardTitle>소셜 로그인</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="h-10 w-full rounded-md bg-yellow-300 text-sm font-semibold text-yellow-950 hover:bg-yellow-400">
            카카오로 시작하기
          </button>
          <button className="h-10 w-full rounded-md border border-surface-border bg-surface text-sm font-semibold text-text hover:bg-surface-muted">
            Google로 시작하기
          </button>
          <p className="pt-2 text-xs text-text-muted">최초 로그인 시 닉네임을 설정합니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
