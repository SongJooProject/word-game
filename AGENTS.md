# AGENTS.md - word-game 프로젝트 가이드라인

## 프로젝트 개요
- **이름**: word-game
- **언어**: Python 3.10+
- **목적**: 뻥뚜리 문제 생성 및 파이썬 게임

## 프로젝트 구조
```
word-game/
├── AGENTS.md
├── pyproject.toml
├── src/
│   └── word_game/
│       ├── __init__.py
│       └── main.py
├── tests/
│   └── __init__.py
├── data/
│   └── words.json
└── docs/
```

## 코딩 컨벤션
- PEP 8 준수
- 라인 길이: 88자
- 따옴표: 더블 쿼트 (")
- 들여쓰기: 4칸

## 검증 시스템
```bash
ruff check .           # 린팅 검사
python -m pytest       # 테스트 실행
```
