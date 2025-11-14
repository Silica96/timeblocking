# Timeblocking - Rust Version

풀스택 Rust로 다시 작성된 Timeblocking 애플리케이션입니다.

## 기술 스택

### 백엔드
- **Axum**: 빠르고 ergonomic한 웹 프레임워크
- **SQLx**: 비동기 타입 안전 SQL 라이브러리
- **PostgreSQL**: 관계형 데이터베이스

### 프론트엔드
- **Leptos**: 현대적인 Rust 웹 프레임워크
- **WebAssembly**: 브라우저에서 실행되는 Rust 코드
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크

### 주요 특징
- **타입 안정성**: 프론트엔드와 백엔드 모두 Rust의 강력한 타입 시스템 활용
- **서버 사이드 렌더링**: SEO와 초기 로드 성능 향상
- **하이드레이션**: 클라이언트 사이드 인터랙티비티
- **제로 코스트 추상화**: Rust의 성능 이점

## 개발 환경 설정

### 사전 요구사항

```bash
# Rust 설치 (rustup 사용)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# cargo-leptos 설치
cargo install cargo-leptos

# wasm32-unknown-unknown 타겟 추가
rustup target add wasm32-unknown-unknown

# Tailwind CSS 설치 (optional, for styling)
npm install -D tailwindcss

# PostgreSQL 설치 또는 Docker 사용
```

### 로컬 개발

```bash
# 환경 변수 설정
cp .env.rust .env

# PostgreSQL 데이터베이스 시작 (Docker 사용)
docker run -d \
  --name timeblocking-postgres \
  -e POSTGRES_DB=timeblocking \
  -e POSTGRES_USER=timeblocking \
  -e POSTGRES_PASSWORD=timeblocking \
  -p 5432:5432 \
  postgres:16-alpine

# 데이터베이스 마이그레이션 실행
cargo install sqlx-cli
sqlx migrate run

# 개발 서버 시작 (핫 리로드 지원)
cargo leptos watch

# 브라우저에서 http://localhost:3000 열기
```

### Docker로 실행

```bash
# 전체 스택 시작 (PostgreSQL + 애플리케이션)
docker-compose -f docker-compose.rust.yml up --build

# 백그라운드 실행
docker-compose -f docker-compose.rust.yml up -d --build

# 로그 확인
docker-compose -f docker-compose.rust.yml logs -f app

# 중지
docker-compose -f docker-compose.rust.yml down

# 볼륨 포함 완전 삭제
docker-compose -f docker-compose.rust.yml down -v
```

## 프로젝트 구조

```
src/
├── main.rs              # 서버 엔트리포인트 (Axum)
├── lib.rs               # 라이브러리 루트
├── app.rs               # Leptos 앱 및 라우팅
├── models/              # 데이터 모델 (공유)
│   └── mod.rs
├── api/                 # API 핸들러 (SSR only)
│   ├── mod.rs
│   └── polls.rs
├── db/                  # 데이터베이스 로직 (SSR only)
│   ├── mod.rs
│   └── polls.rs
├── components/          # Leptos 컴포넌트
│   ├── mod.rs
│   └── calendar_grid.rs
└── pages/               # Leptos 페이지
    ├── mod.rs
    ├── home.rs
    ├── create.rs
    └── poll.rs
```

## 빌드

### 개발 빌드

```bash
cargo leptos build
```

### 프로덕션 빌드

```bash
cargo leptos build --release
```

빌드된 파일:
- 바이너리: `target/release/timeblocking`
- WASM 및 정적 파일: `target/site/`

### 프로덕션 실행

```bash
# 환경 변수 설정
export DATABASE_URL=postgresql://user:password@localhost/timeblocking
export LEPTOS_SITE_ROOT=target/site
export LEPTOS_OUTPUT_NAME=timeblocking

# 서버 시작
./target/release/timeblocking
```

## 데이터베이스

### 마이그레이션 관리

```bash
# 새 마이그레이션 생성
sqlx migrate add <migration_name>

# 마이그레이션 실행
sqlx migrate run

# 마이그레이션 되돌리기
sqlx migrate revert

# 마이그레이션 상태 확인
sqlx migrate info
```

### 스키마

데이터베이스 스키마는 `migrations/20251114000000_init.sql`에 정의되어 있습니다.

주요 테이블:
- `polls`: 투표 정보
- `date_options`: 날짜 옵션
- `votes`: 투표 기록
- `votes_on_dates`: 투표-날짜 관계 (다대다)

## API 엔드포인트

### REST API

- `POST /api/polls` - 새 투표 생성
- `GET /api/polls/:id` - 투표 조회 (결과 포함)
- `POST /api/polls/:id/vote` - 투표 제출

### Leptos 서버 함수

Leptos는 서버 함수를 통해 클라이언트와 서버 간 통신을 처리합니다.
별도의 API 라우트 없이 함수 호출만으로 서버 로직 실행 가능.

## 성능 비교 (Next.js vs Rust)

### 예상 이점

1. **메모리 사용량**: Rust 버전이 훨씬 적은 메모리 사용 (~10-50MB vs ~100-200MB)
2. **시작 시간**: 더 빠른 콜드 스타트
3. **처리량**: 더 높은 요청 처리 성능
4. **번들 크기**: WASM이 최적화된 경우 더 작은 번들

### 트레이드오프

1. **개발 속도**: Rust는 더 엄격하고 학습 곡선이 있음
2. **생태계**: JavaScript/TypeScript보다 웹 생태계가 작음
3. **빌드 시간**: Rust 컴파일이 느릴 수 있음 (특히 첫 빌드)

## 문제 해결

### 일반적인 문제

**문제**: `cargo leptos watch` 실행 시 오류
```bash
# wasm-bindgen 버전 확인
cargo install wasm-bindgen-cli --version 0.2.92
```

**문제**: WASM 빌드 실패
```bash
# 타겟 재설치
rustup target remove wasm32-unknown-unknown
rustup target add wasm32-unknown-unknown
```

**문제**: SQLx 컴파일 타임 검증 오류
```bash
# .env 파일에 DATABASE_URL이 설정되어 있는지 확인
# 또는 오프라인 모드 사용
cargo sqlx prepare
```

### ⚠️ 알려진 문제: Axum 0.7 + Leptos 0.6 라우터 호환성

**현재 상태**: 작업 중 (Work in Progress)

Leptos 0.6과 Axum 0.7 사이의 라우터 통합에 문제가 있습니다:

```rust
error[E0599]: no method named `into_make_service` found for struct `Router<LeptosOptions>`
```

**문제 설명:**
- `leptos_routes()` 또는 `leptos_routes_with_context()`를 호출하면 `Router<LeptosOptions>` 타입이 생성됩니다
- Axum 0.7의 `axum::serve()`는 `into_make_service()` 메서드가 필요합니다
- `Router<LeptosOptions>`에는 이 메서드가 없습니다 (오직 `Router<()>`만 가지고 있음)

**완료된 수정사항:**
1. ✅ SQLx 컴파일 타임 검증 오류 (8개) - `query!` 매크로에서 `query` + `bind` 패턴으로 변경
2. ✅ Navigate 클로저 생명주기 오류 - 비동기 컨텍스트를 위한 적절한 클로닝
3. ✅ State 추출 오류 - `leptos_axum::extract()`에서 `expect_context::<PgPool>()`로 변경
4. ✅ API 핸들러 - Axum state 대신 Leptos context 사용

**시도한 해결 방법:**
1. 별도 API 라우트 사용 → State 타입 충돌
2. `tower::make::Shared` 래퍼 사용 → Service trait bounds 실패
3. 수동 hyper 서버 루프 → Service trait 미구현
4. `with_state(())`로 state 변환 → 타입 불일치
5. fallback_service로 라우터 중첩 → Service trait 문제

**가능한 다음 단계:**
1. Axum 0.6으로 다운그레이드 (Leptos와 더 나은 호환성 가능)
2. 커스텀 serve 구현 사용
3. Leptos 0.7 대기 또는 최신 leptos_axum 버전 확인
4. 커스텀 MakeService 래퍼 구현
5. Axum 라우트 대신 서버 함수만 사용

**임시 해결책:**
현재는 컴파일이 완료되지 않습니다. 라우팅 문제를 해결하기 전까지는 `cargo leptos serve`를 사용할 수 없습니다.

## TypeScript/Next.js 버전과의 차이

### 아키텍처
- **Next.js**: React 서버 컴포넌트 + API 라우트
- **Rust**: Leptos SSR + Axum 핸들러

### 타입 공유
- **Next.js**: TypeScript 타입은 프론트엔드/백엔드에서 공유
- **Rust**: 동일한 struct가 컴파일 타임에 검증되어 공유

### 데이터 페칭
- **Next.js**: fetch API, React Server Components
- **Rust**: Leptos 서버 함수, 브라우저에서는 gloo-net

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여

풀 리퀘스트를 환영합니다! 큰 변경사항은 먼저 이슈를 열어 논의해주세요.
