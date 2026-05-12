# 스밍 랭킹 (streaming-ranking)

스밍(스트리밍) 인증 이미지를 OCR로 자동 판독해 곡별·전체 순위를 매기는 팬덤 웹앱.

## 기능

- **스밍 방법**: 운영자가 등록한 플랫폼별 스밍 가이드
- **공지사항**: 운영자가 작성한 공지 (리치 텍스트 에디터)
- **곡별 순위**: 인증된 재생 횟수 기준 곡별 랭킹 (기간 무관)
- **전체 순위**: 사용자별 인증 재생 횟수 합산 종합 순위
- **소셜 로그인**: 카카오 / Google + 닉네임 설정
- **OCR 자동 인증**: Tesseract.js로 클라이언트 사이드 OCR → 신뢰도 낮을 시 운영자 검수

## 스택

| 영역           | 기술                                                    |
| -------------- | ------------------------------------------------------- |
| 모노레포       | pnpm workspaces + Turborepo                             |
| 언어           | TypeScript                                              |
| 프레임워크     | Next.js 16 (App Router) × 2 (사용자 / 관리자)           |
| DB             | PostgreSQL (Supabase) + Prisma                          |
| 인증           | Supabase Auth (Kakao / Google OAuth)                    |
| 이미지 저장    | Supabase Storage                                        |
| OCR            | Tesseract.js (클라이언트, 한국어 + 영어)                |
| 에디터         | TipTap (admin 공지/가이드 작성)                         |
| 스타일         | Tailwind CSS v4 + 자체 UI 패키지                        |

비용 최소화 전략: Vercel Hobby + Supabase Free + 클라이언트 OCR → 월 ~$0

## 디렉토리 구조

```
streaming/
├── apps/
│   ├── web/              # 사용자 앱 (port 3000)
│   └── admin/            # 관리자 앱 (port 3001)
├── packages/
│   ├── db/               # Prisma 스키마 + 클라이언트
│   ├── shared/           # zod 스키마 / 공통 상수
│   ├── ui/               # 공통 UI 컴포넌트 (Button, Card 등)
│   └── ocr/              # Tesseract.js 래퍼 + 파서
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## 시작하기

### 1. 사전 요구사항

- Node.js 20 이상
- pnpm 11 이상

### 2. 설치

```bash
pnpm install
```

### 3. 환경변수 설정

`.env.example`을 복사해 `.env`로 만들고 값 채우기:

```bash
cp .env.example .env
```

필요한 값:
- `DATABASE_URL` / `DIRECT_URL`: Supabase Postgres 연결 문자열
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 프로젝트 정보
- `SUPABASE_SERVICE_ROLE_KEY`: 서버에서만 사용
- `KAKAO_CLIENT_ID` / `KAKAO_CLIENT_SECRET`: Kakao OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google OAuth
- `ADMIN_ALLOWED_EMAILS`: admin 앱에 접근 가능한 이메일 (쉼표로 구분)

> **주의**: `.env` 파일은 절대 커밋하지 마세요. `.gitignore`에 이미 등록되어 있습니다.

### 4. DB 마이그레이션

```bash
pnpm --filter @streaming/db db:generate   # Prisma client 생성
pnpm --filter @streaming/db db:push       # 스키마를 DB에 push (개발용)
# 또는
pnpm --filter @streaming/db db:migrate    # migration 파일과 함께 적용
```

### 5. 개발 서버 실행

```bash
pnpm dev
# - web:   http://localhost:3000
# - admin: http://localhost:3001
```

### 6. 빌드

```bash
pnpm build
```

## 패키지별 설명

### `apps/web`

사용자용 페이지. 홈, 스밍 방법, 공지사항, 곡별/전체 순위, 인증 업로드, 로그인.

### `apps/admin`

운영자용 페이지. 곡 등록, 공지 작성(에디터), 스밍 가이드 작성(에디터), 인증 검수, 사용자 관리.

### `packages/db`

Prisma 스키마와 싱글턴 PrismaClient.

주요 모델:
- `User`: 카카오/구글 OAuth 정보 + 닉네임 + 권한
- `Song`: 운영자가 등록한 곡 (alias 배열로 OCR 매칭 보조)
- `StreamingProof`: 사용자가 업로드한 인증 이미지 + OCR 결과 + 검수 상태
- `Review`: 운영자 검수 기록
- `Announcement`: 공지사항
- `StreamingGuide`: 플랫폼별 스밍 가이드

### `packages/shared`

zod 스키마와 공통 상수. 클라이언트와 서버 양쪽에서 사용.

### `packages/ui`

공통 UI 컴포넌트 (Button, Card, Input, Badge) + `cn` 유틸. Tailwind v4 기반.

### `packages/ocr`

Tesseract.js 래퍼와 스밍 스크린샷 파서. 플랫폼 감지, 재생 횟수 추출.

## 배포

권장: **Vercel** (web/admin 각각) + **Supabase** (DB/Auth/Storage)

```bash
vercel --cwd apps/web
vercel --cwd apps/admin
```

## 라이선스

MIT (LICENSE 파일 참고)
