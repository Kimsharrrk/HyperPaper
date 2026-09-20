# HyperPaper (하이퍼페이퍼) 📖⚡

> **Cheng Lou의 `@chenglou/pretext` 엔진 기반 차세대 AI 컨텍스추얼 리서치 리더**  
> *Zero-DOM-Thrashing Academic Reader with Kinetic Concept Wires & In-Context Semantic Lenses*

---

## 📌 1. 프로젝트 개요 (원티드 AI 해커톤 출품작)

### 💡 기획 배경 및 문제 정의 (Pain Point)
- **"요약만으로는 깊이 있는 의사결정이 불가능하다"**:  
  기존의 생성형 AI 서비스(ChatGPT, 일반 요약 봇)는 논문이나 전문 문서를 3줄로 요약해 주지만, 연구자·개발자·기획자는 결국 **원문(Full-text)의 세부 맥락과 인과관계**를 직접 읽어야 합니다.
- **전문 용어의 '문맥적 정의(Contextual Definition)' 장벽**:  
  논문 속 단어들은 사전적 의미와 달리 **저자 고유의 조작적 정의(Operational Definition)**로 쓰이며, 문서 전체에 걸쳐 복잡한 인과/종속 관계를 맺고 있습니다.
- **기존 웹 리더의 기술적 한계 (Layout Thrashing & DOM Overhead)**:  
  긴 문서에서 단어 단위로 하이라이팅, 좌표 추적, 개념 간 연결 곡선, 여백 주석을 구현하려면 수천 개의 DOM 요소와 `getBoundingClientRect()` 호출로 인해 브라우저가 극심하게 버벅거립니다.

### 🚀 해결책: HyperPaper
React 코어 팀 출신 Cheng Lou가 공개한 **초경량(15KB) 텍스트 레이아웃 엔진 `@chenglou/pretext`**와 **AI 문맥 추론**을 결합하여, **브라우저 DOM 리플로우가 0%인 60 FPS 초고속 인터랙티브 지식 탐색 독서 경험**을 제공합니다.

---

## ✨ 2. 핵심 기능

### 1. ⚡ Pretext 기반 Kinetic Concept Wires (동적 개념 연결선)
- 본문 속 특정 단어(*Self-Attention*, *Proof-of-Work*, *Selective Hydration* 등)를 클릭하면, Pretext가 마이크로초(0.02ms) 단위로 계산한 단어 위치를 바탕으로 **문서 내 다른 문맥의 연관 단어로 60fps 부드러운 SVG 베지어 곡선**이 실시간으로 뻗어나갑니다.
- 윈도우 크기를 바꾸거나 여백 패널을 여닫아도 렉 없이 매끄럽게 재배치됩니다.

### 2. 🧠 Contextual Semantic Lens (문맥 기반 조작적 정의 팝오버)
- 일반 사전 의미가 아닌:
  - **"이 논문 저자가 이 단어를 어떤 의도와 조작적 정의로 사용하고 있는가?"**
  - **"일반 사전/통용 의미와의 핵심 차이점은 무엇인가?"**
  - **"초등학생도 이해하는 직관적 비유 (ELI5 Lens)"**
  - **"논문 내 이전 가설 및 후속 결론과의 연결 관계"**
  를 구조화된 카드로 즉시 제공합니다.

### 3. 🕸️ Document Knowledge Graph (인터랙티브 문서 지식망)
- 논문 내 핵심 엔티티 간의 인과/종속 관계(defines, implements, uses, optimizes)를 방사형 시각화로 한눈에 파악할 수 있습니다.
- 노드를 클릭하면 Pretext가 즉시 해당 텍스트 위치를 감지하여 부드럽게 스크롤 & 펄스 포커싱합니다.

### 4. 📊 Real-time Pretext Performance Meter (성능 계측기)
- 상단 헤더에 **Pretext 연산 시간(0.02ms)**, **방지된 DOM 리플로우 횟수**, **실시간 60 FPS**를 실시간으로 노출하여 기술적 혁신성을 입증합니다.

### 5. 🎯 심사위원용 3대 랜드마크 프리셋 + 커스텀 문서 분석
- **[Deep Learning]** *Attention Is All You Need* (트랜스포머 논문)
- **[Blockchain/CS]** *Bitcoin: A Peer-to-Peer Electronic Cash System* (사토시 나카모토 백서)
- **[Web Architecture]** *React Server Components & Streaming SSR*
- **[Custom Ingestion]** 사용자가 원하는 논문/기사/기술 문서 텍스트를 붙여넣어 즉시 Pretext 엔진으로 파싱 및 와이어링 가능.

---

## 🛠 3. 사용한 주요 AI 도구 및 활용 방식 (필수 기재 항목)

1. **Google Gemini 1.5 Flash / OpenAI API**:
   - 클릭된 전문 용어 및 전후 문맥을 인지하여 **'조작적 정의'**, **'사전적 의미와의 대비'**, **'ELI5 비유'**, **'개념 간 관계도'**를 구조화된 JSON Schema 형태로 스트리밍 추론.
2. **Cheng Lou의 `@chenglou/pretext` Engine**:
   - 브라우저 DOM 없이 Canvas 2D와 순수 연산(Pure Arithmetic)으로 텍스트의 줄바꿈과 단어 지오메트리를 0.02ms 만에 계산.
   - 단어와 단어를 잇는 SVG 베지어 곡선 앵커 좌표를 실시간 추적하여 제로 리플로우(Zero DOM Thrashing) 환경 구축.

---

## 💻 4. 기술 스택
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Core Layout Engine**: `@chenglou/pretext`
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Paper Aesthetic Typography (Lora & Newsreader)
- **Deployment**: Vercel Ready

---

## 🚀 5. 로컬 실행 방법

```bash
# 1. 저장소 클론 및 패키지 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 3. 브라우저 접속
# http://localhost:3000 에서 HyperPaper를 바로 체험하실 수 있습니다.
```

### 프로덕션 빌드 및 실행
```bash
npm run build
npm run start
```
