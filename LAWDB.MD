# LAWDB.MD - 법령용어 데이터베이스 관리

## 개요
국가법령정보센터 API를 통한 법령용어 수집 및 관리 규칙

## 할루시네이션 방지 규칙
- 법령용어는 국가법령정보센터 API에서만 수집
- 임의로 법령용어를 생성하지 않음
- 수집된 데이터는 전문가 검수 후 문제 생성에 사용
- API 인증값은 `.env` 파일에 저장 (git 제외)

## 키워드 저장 기준

### 저장 대상 (A, B등급만)

#### A등급: 조문 핵심 용어 (40%)
- 조문 제목에 나오는 용어
- 조문 본문에서 정의되는 용어
- 조문 간 연결에 사용되는 용어
- 빈칸 문제 필수 대상

#### B등급: 판례 용어 (35%)
- 대법원 판례에서 사용되는 핵심 용어
- 판례 인용 시 사용되는 표현
- 빈칸 문제 가능 대상

#### 제외 대상
- 학설 용어 (사용자가 직접 선정)
- 논쟁 내용 (사용자가 직접 선정)
- 일상어와 동일한 용어
- 정의가 불명확한 용어
- 폐지된 조문의 용어

### 저장 필드 구조

```json
{
  "term": "영장주의",
  "definition": "체포·구속 등 신체의 자유를 침해하는 처분은 법원의 영장이 있어야 한다는 원칙",
  "article": "형사소송법 제12조",
  "grade": "A",
  "category": "기본원칙",
  "related_terms": ["체포", "구속", "영장"],
  "example_sentence": "체포는 __에 의하지 아니하고는 할 수 없다",
  "is_verified": false,
  "notes": ""
}
```

### 등급 분류 기준

| 등급 | 기준 | 예시 |
|------|------|------|
| A | 조문 핵심 + 빈칸 필수 | 영장주의, 기소독점, 무죄추정원칙 |
| B | 판례 핵심 + 빈칸 가능 | 피의자 인정신문, 구속적부심사 |

## DB 구조
```
db/
├── legal_terms.db      # SQLite 데이터베이스
├── schema.sql          # DB 스키마
└── create_db.bat       # DB 생성 스크립트 (Windows)
```

## DB 생성 방법
1. `db/create_db.bat` 더블클릭
2. 또는 터미널에서: `python scripts/init_db.py`

## 테이블 구조

### subjects (주제)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본키 |
| name | TEXT | 주제명 (예: 형사소송법) |
| description | TEXT | 설명 |
| created_at | TIMESTAMP | 생성일시 |

### keywords (키워드)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본키 |
| subject_id | INTEGER | 주제 ID (외래키) |
| term | TEXT | 법률 용어 |
| definition | TEXT | 정의 |
| source | TEXT | 출처 |
| grade | TEXT | 등급 (A/B) |
| article | TEXT | 조문 번호 |
| is_verified | INTEGER | 검수 여부 (0/1) |
| created_at | TIMESTAMP | 생성일시 |

### questions (문제)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본키 |
| subject_id | INTEGER | 주제 ID (외래키) |
| question_type | TEXT | 문제 유형 (ox/blank) |
| content | TEXT | 문제 내용 |
| answer | TEXT | 정답 |
| hint | TEXT | 힌트 |
| is_verified | INTEGER | 검수 여부 (0/1) |
| created_at | TIMESTAMP | 생성일시 |

## API 정보
- **URL**: http://www.law.go.kr/DRF/lawSearch.do
- **target**: lstrm (법령용어)
- **인증값**: test (개발용) 또는 공공데이터포털 발급 키
- **문서**: https://open.law.go.kr/LSO/openApi/guideResult.do?htmlName=lsTrmListGuide

## 수집 스크립트
- **위치**: `scripts/collect_legal_terms.py`
- **실행**: `python scripts/collect_legal_terms.py`
- **결과**: `data/legal_terms.json`

## 키워드 수집 대상 (형사소송법)

### A등급: 조문 핵심 용어
#### 기본 개념
- 형사소송, 피의자, 피고인, 고소인, 고발인

#### 수사절차
- 수사, 고소, 고발, 진술거부권, 변호인

#### 체포·구속
- 체포, 구속, 영장, 체포영장, 구속영장, 영장주의

#### 기소
- 기소, 기소독점, 공소장, 공소제기

#### 재판절차
- 공판절차, 공판심리주의, 변론, 선고, 판결

#### 판결 유형
- 유죄판결, 무죄판결, 공소기각, 면소

#### 기본 원칙
- 무죄추정원칙, 검증, 증거, 자백, 진술
- 약식절차, 약식명령, 즉시항고, 항소, 상고
- 공소시효, 형의 집행, 집행유예, 선고유예

### B등급: 판례 용어
- 피의자 인정신문
- 구속적부심사
- 영장실질심사
- 공판조서
- 증거능력
- 자백의 임의성
