import { Card, CardContent, CardHeader, CardTitle } from '@streaming/ui';

export const metadata = { title: '인증 업로드 — 스밍 랭킹' };

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">인증 업로드</h1>
      <Card>
        <CardHeader>
          <CardTitle>스밍 스크린샷을 업로드하세요</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-text-muted">
          <p>업로드된 이미지는 OCR로 자동 판독되어 곡과 매칭됩니다.</p>
          <p>판독 신뢰도가 낮을 경우 운영자가 수동으로 검수합니다.</p>
          <p className="text-text">업로드 UI는 곧 제공됩니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
