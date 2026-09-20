import { PaperDocument } from "./types";

export const PAPER_PRESETS: PaperDocument[] = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin",
    published: "NeurIPS 2017",
    venue: "Google Brain & Google Research",
    readingTimeMinutes: 14,
    executiveSummary:
      "2017년까지 지배적이었던 시퀀스 변환 모델들은 어텐션 메커니즘과 결합된 복잡한 순환 신경망 또는 합성곱 신경망에 크게 의존했습니다. 우리는 순환 구조를 완전히 배제하고, 입력과 출력 표현 사이의 전역적 의존성을 도출하기 위해 어텐션 메커니즘에만 전적으로 의존하는 새로운 모델 아키텍처인 트랜스포머(Transformer)를 제안합니다.",
    concepts: [
      // ─── 핵심 어휘 & 기초 개념 ───
      {
        id: "hidden-states",
        name: "hidden states",
        color: "#f59e0b", // Amber
        aliases: ["hidden state", "hidden", "ht"],
        koreanMeaning: "은닉 상태 (외부로 직접 드러나지 않는 내부 기억 벡터)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "RNN 계열이 과거 문맥을 압축해 보관하는 핵심 수단이나, 차례로 넘겨받아야 해서 병렬화를 가로막는 원인",
        operationalDefinition:
          "h_t = f(h_{t-1}, x_t). 이전 시점의 정보와 현재 입력을 종합하여 출력층으로 나가지 않고 모델 내부 계층 간에만 몰래 전달되는 시퀀스 압축 기억 벡터입니다.",
        dictionaryContrast:
          "'숨어있다/감추다'라는 일반 뜻이 아니라, 최종 예측 결과(Output)와 대비되어 '신경망의 은닉층(Hidden Layer) 내부에서만 순환하는 중간 연산 메모리'를 의미합니다.",
        eli5: "귓속말 이어 전달하기 놀이를 할 때, 다른 사람에게는 소리 내어 말하지 않고 다음 사람에게만 살짝 속삭여주는 '머릿속의 비밀 중간 기억'입니다.",
        significance:
          "RNN은 직전 타임스텝의 h_{t-1}이 계산되어야만 현재의 h_t를 구할 수 있어서, GPU의 수천 개 코어가 있어도 단어를 한 글자씩 순차적으로만 처리해야 하는 치명적 병목을 낳았습니다.",
        category: "concept-definition",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "sequential-bottleneck",
            relationType: "defines",
            description: "은닉 상태의 직전 의존성 때문에 전체 연산이 순차적으로 강제됩니다.",
          },
          {
            targetConceptId: "self-attention",
            relationType: "critiques",
            description: "Transformer는 은닉 상태 순차 전달을 버리고 Self-Attention으로 모든 단어를 한 번에 연결합니다.",
          },
        ],
      },
      {
        id: "recurrent-models",
        name: "recurrent",
        color: "#6366f1", // Indigo
        aliases: ["recurrent neural networks", "recurrent models", "recurrence"],
        koreanMeaning: "순환적인 (자기 자신을 되풀이하여 호출하는 방식)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "기존 시퀀스 모델링의 지배자(State-of-the-Art)였으나 본 논문이 극복하고자 하는 구시대의 패러다임",
        operationalDefinition:
          "입력 시퀀스의 각 토큰을 시간 순서(t=1, 2, 3...)에 맞춰 하나씩 차례대로 입력받아 이전 상태를 루프 형태로 갱신하는 인공신경망 구조입니다.",
        dictionaryContrast:
          "단순히 '주기적으로 반복된다'는 뜻이 아니라, 신경망 내부 출력이 다시 자기 자신의 입력으로 피드백되어 들어가는 수학적 루프 구조를 뜻합니다.",
        eli5: "책을 읽을 때 한 문장 전체를 보지 못하고, 돋보기로 글자를 왼쪽부터 오른쪽으로 한 자씩만 차례대로 짚어가며 읽는 방식입니다.",
        significance:
          "문장이 길어질수록 앞쪽 단어의 기억이 희미해지는 장기 의존성(Long-term Dependency) 문제와 GPU 병렬화 불가 문제를 태생적으로 안고 있었습니다.",
        category: "core-primitive",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "self-attention",
            relationType: "critiques",
            description: "Transformer의 Self-Attention은 순환 루프(Recurrence)를 완전히 배제(Eschewing)합니다.",
          },
        ],
      },
      {
        id: "precludes",
        name: "precludes",
        color: "#ef4444", // Red
        aliases: ["preclude"],
        koreanMeaning: "원천 차단하다 / 가로막다 / 불가능하게 하다",
        importance: 3,
        highlightType: "unknown-term",
        flowRole: "RNN의 순차적 특성이 왜 현대 GPU 연산과 양립할 수 없는지 비판하는 핵심 논증 단어",
        operationalDefinition:
          "A가 B의 발생 가능성을 원천적으로 배제함을 뜻함. 여기서는 순차 계산(Sequential nature)이 학습 예제 내 병렬화(Parallelization)를 기술적으로 불가능하게 만듦을 지적합니다.",
        dictionaryContrast:
          "'조금 방해한다' 수준이 아니라, '구조적으로 절대 불가능하게 막아버린다'는 단호한 학술적 배제 선언입니다.",
        eli5: "앞차가 지나가기 전에는 뒷차가 절대 추월할 수 없는 1차선 외길 도로처럼, 연산이 나란히 달릴 수 있는 고속도로 진입을 아예 틀어막는 것입니다.",
        significance:
          "현대 딥러닝은 방대한 GPU 클러스터 병렬 연산이 생명인데, RNN은 모델 구조상 병렬화를 'precludes'하므로 폐기되어야 한다는 논문의 결정적 당위성입니다.",
        category: "unknown-term",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "parallelization",
            relationType: "defines",
            description: "순차 구조가 병렬화(Parallelization)를 원천 차단합니다.",
          },
        ],
      },
      {
        id: "parallelization",
        name: "parallelization",
        color: "#10b981", // Emerald
        aliases: ["parallel", "parallel matrix operations"],
        koreanMeaning: "병렬화 (여러 계산을 동시에 병렬로 한꺼번에 처리함)",
        importance: 3,
        highlightType: "core-flow",
        flowRole: "Transformer가 기존 RNN 대비 100배 빠른 학습 속도를 달성하게 만든 기술적 핵심 목표",
        operationalDefinition:
          "시퀀스의 모든 토큰 간 상호작용을 O(n)개의 순차 단계 대신 거대한 단일 행렬 곱셈 연산으로 변환하여, GPU 코어 수천 개가 동시에 연산하도록 만드는 기법입니다.",
        dictionaryContrast:
          "일반적인 '동시 작업'이 아니라, 선형대수학의 대규모 텐서 곱셈(Matrix Multiplication)을 하드웨어 가속기에 한 번에 밀어넣는 딥러닝 인프라의 핵심을 뜻합니다.",
        eli5: "100명의 학생에게 수학 문제를 풀게 할 때 한 명이 100문제를 차례로 푸는 게 아니라, 100명에게 동시에 한 문제씩 나눠주고 1초 만에 걷는 것과 같습니다.",
        significance:
          "Transformer가 방대한 인터넷 데이터셋(수천억 토큰)으로 사전학습(Pre-training)이 가능해진 것은 오직 병렬화 덕분입니다.",
        category: "mechanism",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "self-attention",
            relationType: "implements",
            description: "Self-Attention 행렬 연산은 모든 토큰을 동시에 병렬 계산합니다.",
          },
        ],
      },
      {
        id: "transduction",
        name: "transduction",
        color: "#8b5cf6", // Purple
        aliases: ["sequence transduction", "transduction models"],
        koreanMeaning: "시퀀스 변환 (입력 시퀀스를 새로운 출력 시퀀스로 바꾸는 작업)",
        importance: 2,
        highlightType: "unknown-term",
        flowRole: "기계 번역, 요약 등 본 논문이 해결하고자 하는 대상 문제 영역을 규정",
        operationalDefinition:
          "가변 길이의 입력 시퀀스(예: 영어 문장)를 받아 완전히 다른 가변 길이의 출력 시퀀스(예: 독일어 문장)로 변환·매핑하는 모든 머신러닝 작업의 총칭입니다.",
        dictionaryContrast:
          "생물학의 유전자 전달이나 물리학의 에너지 변환이 아닌, 자연어처리(NLP)에서 '입력 문장 -> 번역 문장'처럼 구조가 다른 시퀀스로 재생성하는 작업을 뜻합니다.",
        eli5: "프랑스어 문장이라는 레고 블록을 받아서, 의미는 그대로 유지한 채 완전히 다른 형태의 영어 레고 성으로 다시 조립해내는 과정입니다.",
        significance:
          "입력과 출력의 길이가 서로 다르고 어순이 뒤바뀌기 때문에, 고정된 크기의 벡터만으로는 풀기 어려워 어텐션 메커니즘이 필수적입니다.",
        category: "unknown-term",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "encoder-decoder",
            relationType: "uses",
            description: "시퀀스 변환(Transduction)을 위해 인코더-디코더 뼈대를 사용합니다.",
          },
        ],
      },
      {
        id: "eschewing",
        name: "eschewing",
        color: "#ec4899", // Pink
        aliases: ["eschew"],
        koreanMeaning: "과감히 배제하다 / 미련 없이 버리다 / 삼가다",
        importance: 3,
        highlightType: "core-flow",
        flowRole: "논문의 가장 대담한 선언! 수년간 주류였던 RNN 루프를 완전히 내다 버렸음을 천명",
        operationalDefinition:
          "과거의 주류 아키텍처(RNN, LSTM, GRU)에 약간의 수정을 가하는 대신, 순환(Recurrence) 메커니즘 자체를 0%로 완전히 제거하고 시작한다는 저자들의 파격적 방법론입니다.",
        dictionaryContrast:
          "'어쩌다 보니 안 썼다'가 아니라, '의도적으로 의식을 치르듯 철저하게 버렸다'는 강렬한 뉘앙스를 지닌 학술적 표현입니다.",
        eli5: "말이 끄는 마차를 개량해서 더 빠른 바퀴를 다는 대신, 마차를 아예 버리고 제트 엔진(어텐션)만으로 비행기를 만들겠다는 선언입니다.",
        significance:
          "이 한 단어가 논문 제목 'Attention Is All You Need(어텐션만 있으면 충분하다)'의 철학을 100% 대변합니다.",
        category: "core-flow",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "self-attention",
            relationType: "defines",
            description: "순환을 버린 자리를 온전히 Self-Attention으로만 채웠습니다.",
          },
        ],
      },
      {
        id: "sequential-bottleneck",
        name: "sequential",
        color: "#ef4444",
        aliases: ["sequential computation", "sequential nature"],
        koreanMeaning: "순차적인 (앞 단계가 끝나야 다음 단계로 넘어가는 방식)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "RNN 계열이 속도와 확장성에서 패배할 수밖에 없었던 근본 원인 분석",
        operationalDefinition:
          "시간축에 따라 O(T)개의 연속적인 종속 단계가 발생하여, 문장의 길이가 512, 1024로 길어질수록 계산 시간과 메모리 병목이 선형으로 폭증하는 현상입니다.",
        dictionaryContrast:
          "단순한 순서가 아니라, '컴퓨터의 병렬 연산 자원을 놀려두고 1열 종대로만 줄세워 연산하는 낭비적인 계산 방식'을 가리킵니다.",
        eli5: "은행 창구가 1,000개나 있는데 손님들을 1번 창구부터 1,000번 창구까지 한 명씩 차례로 도장 찍고 넘어가게 만드는 비효율적인 줄서기입니다.",
        significance:
          "Transformer는 이 순차 연산 단계(Sequential operations)를 O(n)에서 O(1)의 상수로 축소시켜 딥러닝 스케일링의 혁명을 열었습니다.",
        category: "concept-definition",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "constant-operations",
            relationType: "critiques",
            description: "순차 O(n) 연산을 Transformer가 상수 O(1) 연산으로 압축했습니다.",
          },
        ],
      },

      // ─── 핵심 주제문 (Key Sentences) ───
      {
        id: "thesis-sentence-1",
        name: "In this work we introduce the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism",
        color: "#ec4899", // Hot Pink
        aliases: ["introduce the transformer", "relying entirely on an attention mechanism"],
        koreanMeaning: "[핵심 주제문 ★★★] 순환을 완전히 버리고 어텐션 메커니즘에만 전적으로 의존하는 새 아키텍처 '트랜스포머' 제안",
        importance: 3,
        highlightType: "key-sentence",
        badgeNumber: 1,
        flowRole: "서론의 클라이맥스! 기존 RNN 모델의 한계를 총정리하고 본 논문의 핵심 솔루션을 세상에 선포하는 주제문",
        operationalDefinition:
          "서론(Section 1)의 결론 문장이자 AI 역사의 패러다임을 바꾼 선언문. RNN/LSTM을 전혀 사용하지 않고 오직 Self-Attention만으로 입력과 출력 간 전역 의존성을 학습합니다.",
        dictionaryContrast:
          "단순한 제품 소개가 아니라, 딥러닝 시퀀스 모델링 분야의 근간 가정을 뒤흔든 혁명적 아키텍처 선언입니다.",
        eli5: "'지금까지 여러분이 쓰던 돋보기와 마차(RNN)는 이제 잊으세요. 우리는 오직 빛의 그물망(어텐션)으로만 움직이는 슈퍼카를 만들었습니다.'",
        significance:
          "GPT, BERT, Claude 등 현대 모든 대형언어모델(LLM)의 직접적인 조상이 탄생한 순간을 담고 있는 가장 중요한 문장입니다.",
        category: "key-sentence",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "self-attention",
            relationType: "defines",
            description: "이 주제문에서 공표된 메커니즘이 바로 Self-Attention입니다.",
          },
        ],
      },
      {
        id: "thesis-sentence-2",
        name: "In the Transformer, this is reduced to a constant number of operations",
        color: "#6366f1", // Indigo
        aliases: ["reduced to a constant number of operations", "constant number of operations"],
        koreanMeaning: "[복잡도 혁신 ★★★] 단어 간 거리에 상관없이 필요한 연산 횟수를 상수(O(1))로 대폭 감축",
        importance: 3,
        highlightType: "key-sentence",
        badgeNumber: 2,
        flowRole: "이전 연구(CNN 계열)와의 정밀 복잡도 비교에서 Transformer의 압도적 우월성을 수학적으로 증명하는 핵심 문장",
        operationalDefinition:
          "두 단어 사이의 거리가 d일 때, ConvS2S는 O(d), ByteNet은 O(log d)번의 합성곱을 거쳐야 신호가 전달되었으나, Transformer는 거리에 무관하게 단 1번(O(1))의 행렬곱으로 전역 신호를 연결합니다.",
        dictionaryContrast:
          "수학에서 O(1)은 '입력 크기나 거리가 아무리 멀어져도 연산 횟수가 1번으로 고정된다'는 최상의 효율을 뜻합니다.",
        eli5: "첫 장에 나온 주인공과 1,000페이지 뒤에 나온 결말의 복선을 맞추기 위해 1,000페이지를 다 넘겨볼 필요 없이, 하늘에서 양쪽을 끈 하나로 즉시 묶어버리는 것입니다.",
        significance:
          "긴 문맥에서도 정보가 손실되지 않고 장기 기억이 완벽하게 유지되는 핵심 수학적 비결입니다.",
        category: "key-sentence",
        firstIntroducedSectionId: "sec-2",
        relations: [
          {
            targetConceptId: "multi-head-attention",
            relationType: "optimizes",
            description: "상수 연산 과정에서 발생할 수 있는 해상도 저하를 Multi-Head Attention으로 방어합니다.",
          },
        ],
      },

      // ─── 핵심 아키텍처 및 메커니즘 ───
      {
        id: "self-attention",
        name: "Self-Attention",
        color: "#6366f1",
        aliases: ["self attention", "intra-attention"],
        koreanMeaning: "셀프 어텐션 (문장 스스로가 자기 내부의 단어들을 돌아보며 연결하는 자체 집중 메커니즘)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "트랜스포머의 심장. 외부 상태 전달 없이 문장 내 모든 단어 간의 상호 유사도를 직접 행렬 곱으로 계산",
        operationalDefinition:
          "단일 시퀀스 내의 서로 다른 위치들을 연결하여, 단계적 순환 없이 시퀀스 전체의 표현을 한 번에 계산하는 어텐션 메커니즘입니다.",
        dictionaryContrast:
          "사람이 무언가에 '주의를 집중'하는 심리학적 태도가 아니라, 쿼리(Q)·키(K)·값(V) 벡터를 모든 토큰에 걸쳐 동시에 행렬 곱셈으로 비교하는 엄밀한 수학적 연산입니다.",
        eli5: "추리 소설을 읽을 때, 용의자 이름이 등장할 때마다 5챕터 전에 나온 무기와 장소를 빛나는 실로 자동 연결해주는 마법 독서를 상상해 보세요.",
        significance:
          "LSTM/RNN의 순차적 O(n) 병목을 완전히 제거하여 GPU 병렬 처리가 가능한 O(1) 순차 연산을 실현했습니다.",
        category: "core-primitive",
        firstIntroducedSectionId: "sec-1",
        relations: [
          {
            targetConceptId: "multi-head-attention",
            relationType: "implements",
            description: "다양한 구문·의미 패턴을 포착하기 위해 여러 표현 부분공간으로 확장되어 구현됩니다.",
          },
          {
            targetConceptId: "scaled-dot-product",
            relationType: "defines",
            description: "키 차원 dk의 제곱근으로 스케일된 내적(dot-product)을 통해 구체적으로 계산됩니다.",
          },
          {
            targetConceptId: "positional-encoding",
            relationType: "uses",
            description: "셀프 어텐션은 단어 순서를 인식하지 못하기 때문에, 토큰에 위치 신호를 주입할 필요가 있습니다.",
          },
        ],
      },
      {
        id: "multi-head-attention",
        name: "Multi-Head Attention",
        color: "#ec4899",
        aliases: ["multi-head", "multi head attention"],
        koreanMeaning: "멀티헤드 어텐션 (여러 개의 어텐션 헤드를 병렬로 가동하여 다각도로 문맥을 분석)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "단일 어텐션의 평균화(Averaging)로 인한 정보 희석을 막고, 문법/의미/지시대명사 등 다양한 관계를 동시에 포착",
        operationalDefinition:
          "쿼리·키·값을 서로 다르게 학습된 선형 투영으로 h번(예: 8번) 변환하여 병렬로 어텐션을 수행하고, 그 결과를 연결(concatenate)하는 메커니즘입니다.",
        dictionaryContrast:
          "물리적으로 여러 개의 머리가 달린 것이 아니라, h개의 병렬 어텐션 헤드가 각자 다른 관계 부분공간(예: 문법 vs 주어-동사 관계)에 집중하는 구조입니다.",
        eli5: "범죄 현장을 혼자 조사하는 대신, 8명의 전문 탐정을 동시에 보내는 것입니다. 한 명은 발자국을, 한 명은 지문을, 한 명은 알리바이를 각각 분석합니다.",
        significance:
          "단일 헤드의 평균화로 인해 토큰 간 세밀한 관계 정보가 희석되는 것을 방지합니다.",
        category: "mechanism",
        firstIntroducedSectionId: "sec-3",
        relations: [
          {
            targetConceptId: "scaled-dot-product",
            relationType: "uses",
            description: "각 개별 헤드는 투영된 표현에 대해 스케일드 내적 어텐션을 수행합니다.",
          },
          {
            targetConceptId: "encoder-decoder",
            relationType: "implements",
            description: "인코더 셀프 어텐션, 디코더 마스킹 어텐션, 크로스 어텐션 등 세 가지 방식으로 배치됩니다.",
          },
        ],
      },
      {
        id: "scaled-dot-product",
        name: "Scaled Dot-Product",
        color: "#10b981",
        aliases: ["scaled dot product", "dot-product attention", "Scaled Dot-Product Attention"],
        koreanMeaning: "스케일드 닷 프로덕트 (내적값을 제곱근 차원으로 나누어 기울기 소실을 막은 어텐션 수식)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "어텐션 가중치를 산출하는 가장 밑바닥의 수학 공식: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V",
        operationalDefinition:
          "Attention(Q, K, V) = softmax(Q × Kᵀ / √d_k) × V. 내적값이 매우 커졌을 때 소프트맥스가 극단적으로 쏠리는 것을 막기 위해 √d_k로 스케일링합니다.",
        dictionaryContrast:
          "단순한 기하학적 내적이 아니라, 소프트맥스를 통과시켜 동적 가중치 분포를 생성하는 스케일된 유사도 지표입니다.",
        eli5: "숫자가 너무 커지면 소프트맥스가 확률을 극단적인 0이나 1로 몰아붙여 학습이 멈춥니다. 제곱근으로 나누는 것은 볼륨 다이얼을 줄여 기울기가 건강하게 유지되도록 하는 것입니다.",
        significance:
          "역전파 시 안정적인 기울기를 유지하면서 덧셈 어텐션보다 훨씬 빠르고 공간 효율적입니다.",
        category: "mechanism",
        firstIntroducedSectionId: "sec-3",
        relations: [
          {
            targetConceptId: "self-attention",
            relationType: "implements",
            description: "셀프 어텐션 계산을 실제로 수행하는 핵심 수학 공식을 구성합니다.",
          },
        ],
      },
      {
        id: "queries-keys-values",
        name: "query",
        color: "#f59e0b",
        aliases: ["queries", "keys", "values", "query, keys, values", "key-value"],
        koreanMeaning: "쿼리, 키, 값 (Q, K, V 검색 시스템)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "어텐션 연산의 기본 3요소. 데이터베이스 검색 모델을 미분 가능한 벡터 공간으로 모델링",
        operationalDefinition:
          "Query(찾고자 하는 질문), Key(각 데이터의 목차/색인 태그), Value(실제 데이터 내용물). Q와 K의 일치도를 점수화하여 V를 가중합합니다.",
        dictionaryContrast:
          "DB SQL 쿼리가 아니라, 단어 임베딩에 학습된 가중치 행렬 W_Q, W_K, W_V를 곱해 만든 고차원 의미 벡터들입니다.",
        eli5: "유튜브 검색창에 '고양이 영상'(Query)을 치면, 알고리즘이 수많은 영상의 제목 태그(Key)를 비교해서 일치도가 가장 높은 실제 동영상 클립(Value)을 화면에 띄워주는 원리입니다.",
        significance:
          "모든 토큰이 스스로 질문을 던지고(Q), 다른 토큰들의 라벨(K)을 검토해 가장 중요한 정보(V)만 취사선택하는 지능형 라우팅입니다.",
        category: "core-primitive",
        firstIntroducedSectionId: "sec-3",
        relations: [
          {
            targetConceptId: "scaled-dot-product",
            relationType: "implements",
            description: "Q, K, V 벡터들이 스케일드 닷 프로덕트 공식을 통해 결합됩니다.",
          },
        ],
      },
      {
        id: "positional-encoding",
        name: "Positional Encoding",
        color: "#8b5cf6",
        aliases: ["positional encodings", "position encoding"],
        koreanMeaning: "위치 인코딩 (순서가 없는 어텐션에 단어의 순열/위치 정보를 사인/코사인 파동으로 주입)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "순환(루프)을 버려 단어 순서를 잃어버린 어텐션의 치명적 결함을 완벽히 보완하는 기하학적 나침반",
        operationalDefinition:
          "입력 토큰 임베딩에 직접 더해지는 고정 사인파(sine/cosine) 신호로, 순열에 민감한 시퀀스 순서 정보를 제공합니다.",
        dictionaryContrast:
          "데이터베이스 타임스탬프나 순차적 정수 인덱스(1, 2, 3...)가 아닌, 고차원 공간에 내장된 연속적인 기하학적 주파수 벡터입니다.",
        eli5: "트랜스포머는 모든 단어를 스냅사진처럼 동시에 읽기 때문에, 각 단어에 음높이가 다른 '음악 화음'을 붙여서 누가 먼저 왔는지 알게 합니다.",
        significance:
          "순환 상태 전파 없이도 훈련 중 만난 것보다 더 긴 시퀀스에 모델이 일반화될 수 있게 합니다.",
        category: "core-primitive",
        firstIntroducedSectionId: "sec-3",
        relations: [
          {
            targetConceptId: "self-attention",
            relationType: "optimizes",
            description: "순열 불변 행렬 연산으로 인해 손실된 상대적·절대적 위치 순서를 복원합니다.",
          },
        ],
      },
      {
        id: "encoder-decoder",
        name: "Encoder-Decoder",
        color: "#8b5cf6",
        aliases: ["encoder decoder", "encoder-decoder architecture", "encoder", "decoder"],
        koreanMeaning: "인코더-디코더 (입력을 압축하는 부호화기와 결과를 생성하는 복호화기)",
        importance: 2,
        highlightType: "concept-definition",
        flowRole: "트랜스포머의 전체 아키텍처 골격. 인코더 6층 + 디코더 6층 스택 구조",
        operationalDefinition:
          "인코더가 입력 심볼 시퀀스를 연속적인 표현으로 변환하고, 디코더가 그 표현에서 출력 시퀀스를 한 번에 하나씩 생성하는 아키텍처입니다.",
        dictionaryContrast:
          "하드웨어 코덱이나 영상 압축 기술이 아니라, 크로스 어텐션으로 연결된 동일한 트랜스포머 레이어들이 두 스택으로 쌓인 구조입니다.",
        eli5: "인코더는 프랑스어 단락 전체를 읽고 생각을 결정화하는 이중 언어 독자입니다. 디코더는 그 결정체를 확인하면서 영어 버전을 단어 하나씩 써 내려갑니다.",
        significance:
          "번역 및 생성적 시퀀스-투-시퀀스 모델링의 표준 설계 청사진입니다.",
        category: "architecture",
        firstIntroducedSectionId: "sec-2",
        relations: [
          {
            targetConceptId: "multi-head-attention",
            relationType: "uses",
            description: "스택된 레이어 전반에 걸쳐 세 가지 다른 구성으로 멀티-헤드 어텐션을 사용합니다.",
          },
        ],
      },
      {
        id: "bleu-score",
        name: "BLEU",
        color: "#10b981",
        aliases: ["BLEU score"],
        koreanMeaning: "BLEU 스코어 (기계 번역 결과가 인간 번역과 얼마나 유사한지 매기는 국제 표준 평가지표)",
        importance: 2,
        highlightType: "unknown-term",
        flowRole: "트랜스포머가 기존 최고 모델들(앙상블 포함)을 2.0점 이상 따돌리고 SOTA를 달성했음을 증명한 성적표",
        operationalDefinition:
          "Bilingual Evaluation Understudy. 기계가 생성한 번역문과 전문가 인간 번역문 사이의 n-gram 정밀도(일치율)를 기하평균 내어 0~100점으로 환산한 점수입니다.",
        dictionaryContrast:
          "색깔 '블루(Blue)'가 아니라, 번역 분야의 표준 벤치마크 점수입니다.",
        eli5: "인공지능 번역 시험지의 정답률 채점기입니다. 영어->독일어에서 28.4점을 받아 기존 전 세계 최고 기록을 가뿐히 갈아치웠습니다.",
        significance:
          "훈련 비용은 1/4도 안 들었으면서 모든 선행 연구 모델을 단일 모델로 압도했음을 증명하는 역사적 숫자입니다.",
        category: "metric",
        firstIntroducedSectionId: "sec-4",
        relations: [],
      },
      {
        id: "residual-norm",
        name: "residual connections",
        color: "#6366f1",
        aliases: ["layer normalization"],
        koreanMeaning: "잔차 연결 & 층 정규화 (신경망이 깊어져도 학습이 막히지 않게 뚫어주는 고속도로)",
        importance: 2,
        highlightType: "concept-definition",
        flowRole: "어텐션 레이어마다 LayerNorm(x + Sublayer(x)) 구조를 둘러 신경망의 안정적 수렴을 보장",
        operationalDefinition:
          "서브레이어의 입력 x를 출력에 그대로 바이패스하여 더해주는 Residual Connection과, 각 층 활성화의 평균·분산을 정규화하는 Layer Normalization의 결합입니다.",
        dictionaryContrast:
          "단순한 찌꺼기(Residual)가 아니라, 깊은 신경망에서 기울기 소실을 물리적으로 방지하는 ResNet의 핵심 트릭을 트랜스포머에 이식한 것입니다.",
        eli5: "계단을 100층 올라갈 때 지치지 않도록 각 층마다 비상용 직통 엘리베이터(잔차 연결)와 산소 호흡기(정규화)를 설치해 둔 것입니다.",
        significance:
          "트랜스포머가 층을 12층, 24층, 96층으로 깊게 쌓아도 기울기가 소실되지 않고 초고속 학습을 지속할 수 있게 해주는 든든한 버팀목입니다.",
        category: "mechanism",
        firstIntroducedSectionId: "sec-4",
        relations: [],
      },
    ],
    sections: [
      {
        id: "sec-1",
        number: "1",
        title: "Introduction & Paradigm Shift",
        content: [
          "Recurrent neural networks, long short-term memory, and gated recurrent neural networks have been firmly established as state-of-the-art approaches in sequence modeling. Recurrent models typically factor computation along the symbol positions of input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states ht, as a function of the previous hidden state and the input for position t.",
          "This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples. Recent work has achieved significant improvements in computational efficiency through factorization tricks and conditional computation, yet the fundamental constraint of sequential computation remains unaddressed.",
          "Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences. In this work we introduce the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism known as Self-Attention to draw global dependencies between input and output.",
        ],
      },
      {
        id: "sec-2",
        number: "2",
        title: "Background & Complexity Analysis",
        content: [
          "The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as basic building blocks. In these models, the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions, linearly for ConvS2S and logarithmically for ByteNet. This makes it more difficult to learn dependencies between distant positions.",
          "In the Transformer, this is reduced to a constant number of operations, albeit at the cost of reduced effective resolution due to averaging attention-weighted positions, an effect we counteract with Multi-Head Attention. The canonical Encoder-Decoder paradigm is thus preserved, yet every internal computational layer is transformed into non-recurrent parallel matrix operations.",
        ],
      },
      {
        id: "sec-3",
        number: "3",
        title: "Model Architecture & Attention Variants",
        content: [
          "An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.",
          "We call our particular attention Scaled Dot-Product Attention. The input consists of queries and keys of dimension dk, and values of dimension dv. We compute the dot products of the query with all keys, divide each by the square root of dk, and apply a softmax function to obtain the weights on the values. Scaling prevents the dot products from growing large in magnitude for high dimensions, which would otherwise push the softmax function into regions that have extremely small gradients.",
          "Instead of performing a single attention function with dmodel-dimensional keys, queries and values, we found it beneficial to linearly project the queries, keys and values h times with different learned projections. On each of these projected versions, Multi-Head Attention performs the attention function in parallel, yielding dv-dimensional output values. These are concatenated and once again projected, resulting in the final values.",
          "Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add Positional Encoding to the input embeddings at the bottoms of the encoder and decoder stacks. We chose sine and cosine functions of different frequencies.",
        ],
      },
      {
        id: "sec-4",
        number: "4",
        title: "Experimental Results & Computational Impact",
        content: [
          "On the WMT 2014 English-to-German translation task, the big Transformer model establishes a new state-of-the-art BLEU score of 28.4, outperforming the existing best models, including ensembles, by more than 2.0 BLEU points. On the WMT 2014 English-to-French translation task, our big model achieves a BLEU score of 41.8, outperforming all previously published single models at a fraction of the training cost.",
          "The combination of Self-Attention and Multi-Head Attention with residual connections and layer normalization allows the Transformer to train significantly faster than architectures based on recurrent or convolutional layers, requiring only 3.5 days on 8 P100 GPUs for the base model.",
        ],
      },
    ],
  },

  // ─── 2. Bitcoin Whitepaper ───
  {
    id: "bitcoin-whitepaper",
    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
    authors: "Satoshi Nakamoto",
    published: "October 31, 2008",
    venue: "Cryptography Mailing List",
    readingTimeMinutes: 11,
    executiveSummary:
      "인터넷 상거래는 거의 전적으로 전자 결제를 처리하는 신뢰할 수 있는 제3자 역할의 금융 기관에 의존해 왔습니다. 대부분의 거래에서 시스템이 잘 작동하지만, 신뢰 기반 모델의 근본적인 취약점은 여전히 남아 있습니다. 필요한 것은 신뢰가 아닌 암호학적 증명에 기반한 전자 결제 시스템입니다.",
    concepts: [
      {
        id: "peer-to-peer",
        name: "peer-to-peer",
        color: "#6366f1",
        aliases: ["P2P", "peer to peer"],
        koreanMeaning: "P2P (중앙 중개인 없는 개인 대 개인 직거래망)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "은행이나 금융 기관의 중개 권한을 해체하고 참여자 컴퓨터끼리 직접 장부를 공유하는 탈중앙화 기초",
        operationalDefinition:
          "중앙 집중식 서버나 중개 기관 없이, 네트워크에 참여하는 모든 동등한 컴퓨터(노드)들이 클라이언트이자 서버로서 직접 거래를 전파하고 검증하는 분산 네트워크 모델입니다.",
        dictionaryContrast:
          "단순 파일 공유 토렌트가 아니라, 중앙 은행이나 페이팔 없이도 전 세계 누구에게나 가치를 전송할 수 있는 금융 주권 네트워크를 의미합니다.",
        eli5: "은행을 거쳐서 송금하는 대신, 광장에 모인 모든 사람이 보는 앞에서 내가 너에게 1만 원을 건네고 모두가 자기 공책에 똑같이 적어두는 것과 같습니다.",
        significance:
          "검열 저항성과 거래 수수료 최소화를 달성하여 국가나 기관의 통제로부터 자유로운 화폐 시스템을 만듭니다.",
        category: "architecture",
        firstIntroducedSectionId: "sec-intro",
        relations: [],
      },
      {
        id: "trusted-third-parties",
        name: "trusted third parties",
        color: "#ef4444",
        aliases: ["trusted third party", "financial institutions"],
        koreanMeaning: "신뢰받는 제3자 (은행, 신용카드사, 결제 대행사)",
        importance: 3,
        highlightType: "unknown-term",
        flowRole: "사토시 나카모토가 비판하는 기존 금융의 병목이자 불필요한 비용의 온상",
        operationalDefinition:
          "거래의 유효성을 판정하고 장부를 독점적으로 관리하는 금융 중개 기관. 이들이 존재하기 때문에 거래 중재 비용, 사기 취소 불가, 개인정보 요구가 발생합니다.",
        dictionaryContrast:
          "'신뢰할 수 있어 좋은 곳'이 아니라, '이들을 무조건 믿어야만 거래가 성립되는 신뢰 의존성 모델의 구조적 취약점'을 비판하는 용어입니다.",
        eli5: "친구끼리 1,000원짜리 빵을 사먹을 때마다 옆에 선 은행원 아저씨에게 허락을 맡고 수수료 100원을 떼어줘야 하는 답답한 상태입니다.",
        significance:
          "비트코인의 존재 이유는 이 '신뢰받는 제3자'를 수학과 암호학적 증명으로 완전히 대체하는 데 있습니다.",
        category: "problem",
        firstIntroducedSectionId: "sec-intro",
        relations: [],
      },
      {
        id: "cryptographic-proof",
        name: "cryptographic proof",
        color: "#10b981",
        aliases: ["cryptographic proof instead of trust", "proof"],
        koreanMeaning: "암호학적 증명 (믿음 대신 수학적 암호로 무결성을 입증)",
        importance: 3,
        highlightType: "core-flow",
        flowRole: "인간의 신뢰(Trust)를 수학적 확실성(Proof)으로 교체하는 비트코인의 핵심 사상",
        operationalDefinition:
          "공개키 암호화(디지털 서명)와 해시 함수를 통해, 거래 주체와 자금 소유권이 수학적으로 변조 불가능함을 누구나 독립적으로 검증할 수 있는 알고리즘 메커니즘입니다.",
        dictionaryContrast:
          "판사의 도장이나 은행 직원의 보증서가 아닌, 컴퓨터가 0.001초 만에 참/거짓을 판별할 수 있는 암호학적 서명입니다.",
        eli5: "자물쇠 장수가 정직하다고 믿는 대신, 절대 복제할 수 없는 우주 유일의 디지털 열쇠로 금고를 잠그는 것과 같습니다.",
        significance:
          "신용이나 평판이 없는 낯선 사람끼리도 사기 걱정 없이 거래를 체결할 수 있는 기초를 제공합니다.",
        category: "core-primitive",
        firstIntroducedSectionId: "sec-intro",
        relations: [],
      },
      {
        id: "double-spending",
        name: "Double-Spending",
        color: "#ef4444",
        aliases: ["double spending", "double spend attack"],
        koreanMeaning: "이중 지불 (동일한 디지털 코인을 두 번 결제해 먹튀하는 치명적 사기)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "디지털 화폐가 30년간 풀지 못했던 난제이자, 비트코인이 작업 증명(PoW)으로 풀어낸 핵심 문제",
        operationalDefinition:
          "물리적 화폐와 달리 디지털 토큰은 복사-붙여넣기가 가능하여, 동일한 디지털 코인을 두 개의 별개 수신자에게 동시에 전송해 물건을 가로채는 공격입니다.",
        dictionaryContrast:
          "회계상의 단순 장부 실수가 아니라, 제3자의 중개 없이 순수 P2P 환경에서 화폐 가치를 파괴하는 근본적인 결함입니다.",
        eli5: "10달러짜리 지폐를 복사기로 10장 복사해서 10개 편의점에서 동시에 과자를 사먹고 도망치는 수법입니다.",
        significance:
          "비트코인은 블록체인과 작업 증명 기반의 타임스탬프 서버를 구축하여 이 문제를 사상 최초로 탈중앙 방식으로 완벽하게 해결했습니다.",
        category: "problem",
        firstIntroducedSectionId: "sec-intro",
        relations: [],
      },
      {
        id: "proof-of-work",
        name: "Proof-of-Work",
        color: "#f59e0b",
        aliases: ["proof of work", "PoW", "hashcash"],
        koreanMeaning: "작업 증명 (엄청난 컴퓨터 전기 연산을 갈아넣어 장부의 진실성을 입증하는 합의 알고리즘)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "분산 네트워크에서 악의적인 공격자가 가짜 장부를 만들지 못하도록 열역학적 비용을 청구하는 핵심 보안 기둥",
        operationalDefinition:
          "블록 데이터와 임의의 논스(nonce)를 조합해 SHA-256 해시를 돌렸을 때, 결과값의 앞자리가 지정된 개수의 0비트로 시작하는 희귀한 값을 찾는 암호학적 연산입니다.",
        dictionaryContrast:
          "노동 시간표나 근태 기록이 아니라, 컴퓨터가 수조 번의 주사위를 굴려 찾아낸 '수학적 에너지 소비의 흔적'입니다.",
        eli5: "금 채굴처럼 컴퓨터가 수천만 번 연산을 돌려야 겨우 발견되는 금괴 번호입니다. 찾기는 엄청나게 힘들지만, 다른 사람이 검산하는 데는 0.001초밖에 안 걸립니다.",
        significance:
          "장부를 조작하려면 전 세계 선량한 채굴자 전체의 51%가 넘는 컴퓨터 연산력을 혼자서 압도해야 하므로 사실상 해킹이 불가능해집니다.",
        category: "mechanism",
        firstIntroducedSectionId: "sec-pow",
        relations: [],
      },
      {
        id: "nonce",
        name: "nonce",
        color: "#8b5cf6",
        aliases: ["nonce in the block"],
        koreanMeaning: "논스 (단 한 번만 쓰이는 임의의 숫자, 채굴 정답을 맞추기 위한 번호표)",
        importance: 2,
        highlightType: "unknown-term",
        flowRole: "작업 증명(PoW)에서 목표 해시값을 맞추기 위해 채굴자가 0부터 1씩 올리며 대입하는 변수",
        operationalDefinition:
          "Number used ONCE. 블록 헤더에서 유일하게 채굴자가 자유롭게 바꿀 수 있는 32비트 필드로, 조건을 만족하는 해시를 찾을 때까지 계속 1씩 증가시킵니다.",
        dictionaryContrast:
          "일상 영어의 '당분간(for the nonce)'이 아니라, 암호학에서 '해시 퍼즐을 풀기 위해 딱 한 번 임시로 넣는 숫자'입니다.",
        eli5: "자물쇠 비밀번호 4자리를 맞추기 위해 0000, 0001, 0002... 열릴 때까지 번호를 하나씩 돌려보는 번호판입니다.",
        significance:
          "이 단순한 숫자를 무한히 대입하는 무작위 대입(Brute-force) 연산이 비트코인 블록체인의 난이도와 불변성을 지탱합니다.",
        category: "unknown-term",
        firstIntroducedSectionId: "sec-pow",
        relations: [],
      },
      {
        id: "longest-chain",
        name: "Longest Chain",
        color: "#3b82f6",
        aliases: ["longest chain rule", "heaviest chain"],
        koreanMeaning: "최장 체인 규칙 (가장 많은 작업 증명이 누적된 가장 긴 블록체인을 진짜 역사로 인정하는 절대 원칙)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "동시에 두 개의 블록이 생성되어 장부가 갈라졌을 때(포크), 네트워크 전체가 다툼 없이 하나로 수렴하는 합의 헌법",
        operationalDefinition:
          "네트워크에 참여하는 모든 정직한 노드는 가장 많은 누적 연산 난이도(Proof-of-Work)가 투입된 가장 긴 블록의 가지를 유일한 진실로 채택하고 그 위에 새 블록을 얹습니다.",
        dictionaryContrast:
          "파일의 용량이나 물리적 글자 수가 아니라, '역사상 가장 많은 컴퓨터 연산 에너지가 투입된 블록체인의 깊이'를 뜻합니다.",
        eli5: "갈림길에서 두 무리가 갈라졌을 때, 더 많은 사람들이 땀 흘려 가장 깊고 넓게 뚫어놓은 길을 모든 마을 사람들이 공식 도로로 인정하는 규칙입니다.",
        significance:
          "중앙 통제자나 투표소 없이도 전 세계 수십만 대의 노드가 100% 동일한 거래 내역에 만장일치로 합의할 수 있는 천재적인 비결입니다.",
        category: "architecture",
        firstIntroducedSectionId: "sec-nodes",
        relations: [],
      },
    ],
    sections: [
      {
        id: "sec-intro",
        number: "1",
        title: "Introduction",
        content: [
          "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent Double-Spending.",
          "We propose a solution to the Double-Spending problem using a peer-to-peer network. The network timestamps transactions by hashing them into an ongoing chain of hash-based proof-of-work, forming a record that cannot be changed without redoing the work.",
        ],
      },
      {
        id: "sec-pow",
        number: "2",
        title: "Proof-of-Work & Consensus",
        content: [
          "To implement a distributed timestamp server on a peer-to-peer basis, we will need to use a proof-of-work system similar to Adam Back's Hashcash, rather than newspaper or Usenet posts. The Proof-of-Work involves scanning for a value that when hashed, such as with SHA-256, the hash begins with a number of zero bits.",
          "For our timestamp network, we implement the Proof-of-Work by incrementing a nonce in the block until a value is found that gives the block's hash the required zero bits. Once the CPU effort has been expended to make it satisfy the Proof-of-Work, the block cannot be changed without redoing the work. As later blocks are chained after it, the work to change the block would include redoing all the blocks after it.",
        ],
      },
      {
        id: "sec-nodes",
        number: "3",
        title: "Network & The Longest Chain Rule",
        content: [
          "Nodes always consider the Longest Chain to be the correct one and will keep working on extending it. If two nodes broadcast different versions of the next block simultaneously, some nodes may receive one or the other first. In that case, they work on the first one they received, but save the other branch in case it becomes longer.",
          "The tie will be broken when the next Proof-of-Work is found and one branch becomes longer; the nodes that were working on the other branch will then switch to the Longest Chain. This simple rule guarantees mathematical consensus without centralized coordinators.",
        ],
      },
    ],
  },

  // ─── 3. React Server Components ───
  {
    id: "react-server-components",
    title: "Next-Gen Web Architecture: Server Components & Streaming SSR",
    authors: "Dan Abramov, Sebastian Markbåge, Lauren Tan, Joe Savona",
    published: "React Core Architecture RFC",
    venue: "Meta & Vercel Systems Engineering",
    readingTimeMinutes: 10,
    executiveSummary:
      "클라이언트 측 JavaScript 번들이 비대해지면서 모바일 기기의 첫 상호작용 시간(TTI)과 배터리 효율이 저하되고 있습니다. React Server Components(RSC)는 컴포넌트가 서버에서만 실행되고, 직렬화된 가상 DOM 페이로드를 번들 풋프린트 없이 클라이언트에 직접 스트리밍할 수 있는 아키텍처를 도입합니다.",
    concepts: [
      {
        id: "bundle-size",
        name: "bundle size",
        color: "#ef4444",
        aliases: ["bundle sizes", "JavaScript bundles", "bundle footprint"],
        koreanMeaning: "번들 크기 (브라우저가 내려받아야 하는 JS 코드의 총 용량)",
        importance: 3,
        highlightType: "unknown-term",
        flowRole: "모바일 웹을 느리게 만들고 배터리를 소모시키는 주범이자, RSC가 0바이트로 없애버린 문제",
        operationalDefinition:
          "사용자가 사이트에 접속했을 때 브라우저가 다운로드, 파싱, 컴파일, 실행해야 하는 모든 클라이언트 자바스크립트 라이브러리의 총 파일 크기입니다.",
        dictionaryContrast:
          "단순한 파일 크기가 아니라, 저사양 스마트폰의 CPU를 점유해 클릭을 먹통으로 만드는 웹 성능의 최대 적입니다.",
        eli5: "식당에서 식사 한 끼 하려는데 50kg짜리 무쇠 가마솥과 주방 조리도구를 트럭으로 끌고 와서 손님 식탁에 펼쳐놓는 격입니다.",
        significance:
          "RSC는 무거운 라이브러리(Markdown 파서 등)를 서버에만 남겨두어 클라이언트 다운로드 크기를 '0바이트'로 만듭니다.",
        category: "problem",
        firstIntroducedSectionId: "sec-rsc-intro",
        relations: [],
      },
      {
        id: "server-components",
        name: "Server Components",
        color: "#06b6d4",
        aliases: ["RSC", "react server components"],
        koreanMeaning: "서버 컴포넌트 (브라우저가 아닌 오직 서버에서만 실행되는 리액트 컴포넌트)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "클라이언트 JS 번들 제로(Zero-bundle)와 즉각적인 데이터베이스 직접 접근을 가능케 한 새 아키텍처",
        operationalDefinition:
          "빌드 시점이나 서버 요청 시점에만 실행되어 브라우저 번들에 자바스크립트 코드가 1바이트도 포함되지 않는 혁신적인 리액트 컴포넌트입니다.",
        dictionaryContrast:
          "과거의 레거시 PHP나 JSP 템플릿 렌더링이 아니라, 가상 DOM의 트리 구조를 유지하면서 클라이언트 컴포넌트와 유기적으로 합성되는 현대적 스트리밍 시스템입니다.",
        eli5: "주방 가전제품을 손님 집에 보내서 요리하게 하는 대신, 식당 주방에서 셰프가 완벽히 요리한 맛있는 음식을 깔끔한 배달 박스에 담아 보내는 것입니다.",
        significance:
          "보안이 중요한 API 키나 무거운 패키지가 브라우저로 유출되지 않으며, 첫 페이지 로딩 속도를 극적으로 단축합니다.",
        category: "core-primitive",
        firstIntroducedSectionId: "sec-rsc-intro",
        relations: [],
      },
      {
        id: "selective-hydration",
        name: "Selective Hydration",
        color: "#84cc16",
        aliases: ["progressive hydration", "concurrent hydration"],
        koreanMeaning: "선택적 하이드레이션 (사용자가 클릭한 버튼부터 우선적으로 살려내는 스마트 로딩)",
        importance: 3,
        highlightType: "concept-definition",
        flowRole: "페이지 전체가 로드될 때까지 화면이 굳어있던 기존 SSR의 고질적 폭포수(Waterfall) 병목을 타파",
        operationalDefinition:
          "React 18 동시성 스케줄러를 활용해, 사용자가 마우스를 올리거나 클릭한 인터랙티브 컴포넌트를 감지하여 그 영역의 자바스크립트 바인딩을 최우선으로 실행하는 기술입니다.",
        dictionaryContrast:
          "수분을 보충하는 화장품이 아니라, 정적 HTML 껍데기에 자바스크립트 생명력(이벤트 리스너)을 불어넣는 리액트 용어입니다.",
        eli5: "공연장에 1,000명의 관객이 다 입장할 때까지 아무도 무대에 못 올라오게 막는 대신, 앞자리에 먼저 앉은 관객부터 바로 공연을 시작하는 것입니다.",
        significance:
          "페이지 일부가 아직 다운로드 중이어도 이미 뜬 검색창이나 로그인 버튼을 지체 없이 즉각 클릭할 수 있게 만듭니다.",
        category: "mechanism",
        firstIntroducedSectionId: "sec-hydration",
        relations: [],
      },
      {
        id: "suspense-boundaries",
        name: "Suspense",
        color: "#f59e0b",
        aliases: ["Suspense boundaries", "suspense"],
        koreanMeaning: "서스펜스 (느린 데이터가 로딩될 때까지 대체 화면을 보여주며 페이지 차단을 막는 경계선)",
        importance: 2,
        highlightType: "concept-definition",
        flowRole: "데이터 패칭 단위로 UI를 쪼개어, 준비된 HTML 청크부터 즉시 브라우저로 스트리밍하게 해주는 핵심 도구",
        operationalDefinition:
          "비동기 작업이 완료될 때까지 fallback UI(스켈레톤 등)를 렌더링하고, 데이터가 준비되는 즉시 해당 슬롯의 완성된 UI를 스트리밍 교체하는 리액트 경계 컴포넌트입니다.",
        dictionaryContrast:
          "영화의 긴장감(Suspense)이 아니라, '컴포넌트 렌더링을 잠시 멈추고 보류(Suspend)한다'는 컴퓨터 과학 용어입니다.",
        eli5: "음식점에서 코스 요리가 다 나올 때까지 손님을 굶기지 않고, 애피타이저부터 완성되는 대로 하나씩 서빙하는 것입니다.",
        significance:
          "느린 데이터베이스 쿼리 하나 때문에 전체 웹사이트 화면이 하얗게 멈추는 백화 현상을 완벽하게 방지합니다.",
        category: "mechanism",
        firstIntroducedSectionId: "sec-hydration",
        relations: [],
      },
    ],
    sections: [
      {
        id: "sec-rsc-intro",
        number: "1",
        title: "The Bundle Size Dilemma",
        content: [
          "Over the past decade, single-page applications shifted significant rendering logic to the client browser. While this created fluid user experiences, it resulted in massive JavaScript bundles that delay first interaction. Server Components solve this fundamental trade-off by letting developers write components that render exclusively on the server.",
          "With Server Components, heavy dependencies like markdown parsers, syntax highlighters, and database drivers remain on the server, contributing zero bytes to the client download. The output is streamed as a specialized JSON-like virtual representation.",
        ],
      },
      {
        id: "sec-hydration",
        number: "2",
        title: "Selective Hydration & Streaming",
        content: [
          "Traditional server-side rendering forced an all-or-nothing waterfall: fetch all data on server, render all HTML on server, load all scripts on client, and hydrate everything before anything became interactive.",
          "Combined with Selective Hydration, React can stream HTML chunks as soon as data arrives wrapped in Suspense boundaries. If the user clicks on a component before it has finished hydrating, React prioritizes that specific component, delivering instantaneous responsiveness.",
        ],
      },
    ],
  },
];
