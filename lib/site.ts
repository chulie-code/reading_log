// 브랜드명·카피·콘텐츠 상수를 한 곳에서 관리합니다.
// 서비스명을 바꾸려면 BRAND 한 곳만 수정하면 됩니다.

export const BRAND = {
  name: "독자저자",
  tagline: "읽는 사람에서, 쓰는 사람으로",
  email: "hello@dokjajeoja.kr",
} as const;

export const HERO = {
  eyebrow: "독자에서 저자로 · AI 독서기록 서비스",
  headline: ["당신이 밑줄 친 문장이,", "한 권의 책이 됩니다"],
  subline:
    "흩어진 기록을 AI가 정리하고, 삶에서 어떻게 실천할지 제안하며, 당신의 기록을 엮어 ‘나만의 책’으로 완성합니다.",
  cta: "대기자 명단에 등록하기",
  note: "출시 소식을 가장 먼저 받아보세요. 스팸은 보내지 않습니다.",
} as const;

export const PROBLEM = {
  title: "좋은 문장을 적어두지만, 다시 펴보지 않습니다",
  points: [
    "노트와 앱 여기저기 흩어진 기록들. 정작 다시 찾아 읽는 일은 드뭅니다.",
    "“이 구절 정말 좋다”고 느꼈지만, 그 깨달음이 일상으로 이어지지 못합니다.",
    "한 해 동안 무엇을 읽고 무엇이 남았는지, 손에 잡히는 게 없습니다.",
  ],
} as const;

export const FEATURES = {
  title: "기록에서 그치지 않습니다",
  subtitle: "AI가 당신의 독서를 세 단계로 더 깊게 만듭니다.",
  items: [
    {
      icon: "✍️",
      title: "AI 정리",
      body: "흩어진 문장과 생각을 주제별로 묶고, 핵심을 요약해 다시 꺼내보기 좋게 정리합니다.",
    },
    {
      icon: "🌱",
      title: "실천 추천",
      body: "읽은 내용을 현실에서 어떻게 적용할지, 당신의 상황에 맞는 구체적인 행동을 제안합니다.",
    },
    {
      icon: "📖",
      title: "나만의 책",
      body: "쌓인 기록을 한 권의 책으로 엮습니다. 당신이 읽고 사유한 흔적이 작품이 됩니다.",
    },
  ],
} as const;

export const STEPS = {
  title: "이렇게 사용합니다",
  items: [
    {
      step: "01",
      title: "기록하기",
      body: "마음을 울린 문장과 떠오른 생각을 부담 없이 적어둡니다.",
    },
    {
      step: "02",
      title: "AI가 정리·추천",
      body: "AI가 기록을 정리하고, 삶에 반영할 방법을 제안합니다.",
    },
    {
      step: "03",
      title: "나의 책 완성",
      body: "한 해의 기록이 모여 ‘내가 쓴 한 권의 책’으로 완성됩니다.",
    },
  ],
} as const;

export const AUDIENCE = {
  title: "성장하는 독서가를 위해 만들었습니다",
  body: "더 나은 내가 되기 위해 책을 읽는 사람들. 읽는 데서 멈추지 않고, 읽은 것을 삶으로 가져오려는 당신을 위한 서비스입니다.",
  tags: ["자기계발 독서가", "기록을 사랑하는 사람", "삶에 적용하려는 실천가", "한 해를 정리하고픈 사람"],
} as const;

export const WAITLIST = {
  title: "가장 먼저 만나보세요",
  body: "출시를 준비하고 있습니다. 이메일을 남겨주시면 오픈 소식과 얼리 액세스를 가장 먼저 보내드립니다.",
  placeholder: "your@email.com",
  button: "등록하기",
  pending: "등록 중...",
  successTitle: "등록이 완료되었습니다 🎉",
  successBody: "오픈 소식을 가장 먼저 전해드릴게요. 곧 만나요!",
} as const;
