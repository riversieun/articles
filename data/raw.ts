// 콘텐츠 데이터. summary(원문 요약)는 한글로, 최대 2문장. 문단은 [영어, 한국어] 문장 쌍의 배열이고, 소제목은 { h: [영어, 한국어] }, 원문에서 건너뛴 자리는 { gap: true } 로 문단 사이에 둔다.
// 영어 제목은 첫 글자만 대문자로 적어도 화면에서 Title Case로 바뀐다.
import type { RawArticle } from "@/lib/types";

export const RAW: RawArticle[] = [
  {
    // 진짜 아티클 1호 (테스트). 원문: Figma Blog. 번역·요약은 AI 초안이며 운영자 검수 전.
    id: 'r1', src: 'figma', topic: 'process', sourceLine: 'Figma', date: '2026.05.23', url: 'https://www.figma.com/blog/what-matters-when-anyone-can-build/',
    titleKo: '누구나 만들 수 있을 때, 무엇이 중요한가',
    titleEn: 'What matters when anyone can build',
    summary: 'AI가 누구나 프로덕트를 만드는 사람으로 만들어 준다면, 진짜 경쟁력은 무엇을 출시할 가치가 있는지 아는 것입니다.',
    // 아티클 상세(요약형)용. 인사이트·적용 아이디어는 AI 초안이며 운영자 검수 전. 인용은 아래 paras의 문장을 그대로 옮겼다.
    insights: [
      {
        title: '처음 떠오른 아이디어에 매달리면 놓치는 것이 많습니다.',
        body: '가능성의 영역은 넓습니다. 하나만 고르기보다 서로 다른 여러 방향을 동시에 탐색하고, 각각을 처음부터 끝까지 이어지는 경험으로 구체화해야 올바른 아이디어를 찾을 수 있습니다.',
      },
      {
        title: '“이 정도면 충분하다”가 가장 위험한 기준이 됩니다.',
        body: '누구나 빠르게 만들 수 있는 시대에는 결과물이 평범한 쪽으로 쏠립니다. 기억에 남는 것과 기능만 하는 것을 가르는 것은 craft이고, 그것은 받아들이는 일이 아니라 선택하는 일입니다.',
      },
      {
        title: '속도, 방향, craft는 맞바꾸는 것이 아닙니다.',
        body: '최고의 팀은 빠르게 움직이고, 신중하게 선택하고, 끈질기게 다듬습니다. 무엇이든 만들 수 있다면 유일한 우위는 무엇을 선택하고 얼마나 잘 빚어내느냐입니다.',
      },
    ],
    quotes: [
      {
        en: 'The better way, the way you actually find the right idea, is to go broad and deep at the same time.',
        ko: '더 나은 방법, 즉 올바른 아이디어를 실제로 찾는 방법은 넓게, 그리고 동시에 깊게 파고드는 것입니다.',
      },
      {
        en: 'But craft is what separates the memorable from the merely functional.',
        ko: '하지만 기억에 남는 것과 그저 기능만 하는 것을 가르는 것은 craft입니다.',
      },
      {
        en: 'Because when anything can be built, the only edge is in what you choose and how well you shape it.',
        ko: '무엇이든 만들 수 있는 시대에는, 유일한 우위가 무엇을 선택하고 그것을 얼마나 잘 빚어내는가에 있기 때문입니다.',
      },
    ],
    actions: [
      '지금 만들고 있는 기능에서 처음 떠올린 방향 말고, 전혀 다른 방향 두 가지를 더 스케치해 보기',
      '최근 출시한 결과물 중 “이 정도면 충분하다”며 넘어간 부분을 하나 골라 다시 다듬어 보기',
      '다음 회고에서 속도, 방향, craft 중 가장 부족한 하나를 팀과 함께 점검해 보기',
    ],
    paras: [
      { h: ['Choosing what’s worth building', '무엇을 만들 가치가 있는지 고르기'] },
      [
        ['Figuring out what’s actually worth building isn’t obvious.', '무엇이 정말 만들 가치가 있는지 알아내는 일은 쉽지 않습니다.'],
        ['The space of possibilities is vast, and navigating it is as much art as method.', '가능성의 영역은 넓고, 그 안에서 길을 찾는 일은 방법만큼이나 감각의 영역이기도 합니다.'],
        ['A common trap, especially for newer builders, is latching onto the first idea and going deep.', '특히 초보 빌더에게 흔한 함정은 처음 떠오른 아이디어에 매달려 깊이 파고드는 것입니다.']
      ],
      { gap: true },
      [
        ['The better way, the way you actually find the right idea, is to go broad and deep at the same time.', '더 나은 방법, 즉 올바른 아이디어를 실제로 찾는 방법은 넓게, 그리고 동시에 깊게 파고드는 것입니다.'],
        ['AI now makes it possible to explore multiple directions in parallel while pushing each far enough to feel real.', '이제 AI 덕분에 여러 방향을 병렬로 탐색하면서도, 각각을 실감 날 만큼 충분히 밀어붙일 수 있습니다.'],
        ['Instead of choosing one path, you generate several distinct directions and develop each into something concrete: not just ideas, but end-to-end experiences.', '하나의 길을 고르는 대신 서로 다른 여러 방향을 만들고, 각각을 구체적인 결과물로 발전시킵니다. 아이디어에 그치지 않고, 처음부터 끝까지 이어지는 경험으로 말입니다.']
      ],
      { h: ['Making it yours', '나만의 것으로 만들기'] },
      [
        ['Choosing the right direction gets you to something worth building.', '올바른 방향을 고르면 만들 가치가 있는 무언가에 다다릅니다.'],
        ['But when anyone can build and build quickly, everything drifts toward what’s typical, making “good enough” both easy to reach and easy to accept.', '하지만 누구나 빠르게 만들 수 있는 시대에는 모든 것이 평범한 쪽으로 쏠리고, “이 정도면 충분하다”는 수준에 도달하기도, 받아들이기도 쉬워집니다.']
      ],
      { gap: true },
      [
        ['But craft is what separates the memorable from the merely functional.', '하지만 기억에 남는 것과 그저 기능만 하는 것을 가르는 것은 craft입니다.'],
        ['It’s active: choosing, not accepting.', 'craft는 능동적인 일입니다. 받아들이는 것이 아니라 선택하는 것입니다.'],
        ['Revisiting and interrogating each decision, refining, removing, tightening, pushing past the first few versions until the work has a point of view.', '각 결정을 다시 살펴보고 따져 묻고, 다듬고, 덜어내고, 조이면서, 작업이 자기만의 관점을 갖출 때까지 처음 몇 버전을 넘어 밀고 나가는 것입니다.']
      ],
      { h: ['What matters now', '지금 중요한 것'] },
      [
        ['Speed, direction, and craft.', '속도, 방향, 그리고 craft입니다.']
      ],
      [
        ['The best teams don’t trade these off—they move quickly, choose deliberately, and refine relentlessly.', '최고의 팀은 이 셋을 맞바꾸지 않습니다. 빠르게 움직이고, 신중하게 선택하고, 끈질기게 다듬습니다.'],
        ['That’s what it takes to build something that actually stands out.', '그렇게 해야 정말로 눈에 띄는 무언가를 만들 수 있습니다.'],
        ['Because when anything can be built, the only edge is in what you choose and how well you shape it.', '무엇이든 만들 수 있는 시대에는, 유일한 우위가 무엇을 선택하고 그것을 얼마나 잘 빚어내는가에 있기 때문입니다.']
      ]
    ]
  },

  // ───── 더미 글 3개 (화면 확인용). 제목·요약·인사이트·인용은 Paper 시안의 샘플 문구이고 실제 원문이 아니다. 운영 빌드에서는 숨겨진다(NEXT_PUBLIC_SHOW_DUMMY).
  {
    id: 'd1', dummy: true, src: 'nng', topic: 'process', sourceLine: 'NN/g', date: '2026.11.03', url: 'https://www.nngroup.com/',
    titleKo: '사용자가 온보딩을 건너뛰는 이유와 그 대안',
    titleEn: 'Why users skip your onboarding (and what to do instead)',
    summary: '사용자에게 적절한 온보딩을 제공할 수 있는 방안을 추천하는 글이에요.',
    insights: [
      { title: "사용자는 온보딩을 '배우는 시간'이 아니라 '기다리는 시간'으로 느낍니다.", body: '앱을 연 목적이 분명할수록 설명 화면은 장애물이 됩니다. 사용자는 원래 하려던 일에 닿기 전까지의 모든 단계를 기다림으로 받아들입니다.' },
      { title: '가장 잘 작동하는 온보딩은 화면이 아니라 타이밍입니다.', body: '기능을 처음 쓰려는 순간에 한 줄짜리 힌트를 보여주는 편이 처음에 길게 설명하는 것보다 기억에 오래 남습니다.' },
      { title: '건너뛰기 비율은 실패 지표가 아닐 수 있습니다.', body: '건너뛴 사용자가 핵심 작업을 끝내는지를 함께 봐야 온보딩의 진짜 효과를 알 수 있습니다.' },
    ],
    quotes: [
      { en: 'Users don’t read onboarding. They tolerate it until they can get to the thing they came for.', ko: '사용자는 온보딩을 읽지 않습니다. 원래 하려던 일에 닿을 때까지 견딜 뿐입니다.' },
      { en: 'The best tutorial is the one that appears exactly when it’s needed, and not a second earlier.', ko: '가장 좋은 튜토리얼은 꼭 필요한 순간에 나타나고, 그보다 일찍 나타나지 않습니다.' },
      { en: 'A high skip rate is a signal, not a verdict.', ko: '높은 건너뛰기 비율은 신호일 뿐, 판결이 아닙니다.' },
    ],
    actions: [
      '우리 앱 온보딩 화면 중 ‘건너뛰기’가 가장 많이 눌리는 단계를 찾아보기',
      '첫 화면 설명 하나를 없애고, 해당 기능을 처음 누를 때 뜨는 힌트로 옮겨보기',
      '건너뛴 사용자와 끝까지 본 사용자의 핵심 작업 완료율을 나란히 비교해 보기',
    ],
    paras: [
      { h: ['Why people skip', '사람들이 건너뛰는 이유'] },
      [
        ['People open an app with a goal in mind.', '사람들은 목적을 가지고 앱을 엽니다.'],
        ['Anything that stands between them and that goal feels like friction.', '그 목적과 자신 사이에 놓인 모든 것은 마찰처럼 느껴집니다.']
      ],
      { gap: true },
      [
        ['Show help at the moment of need instead of up front.', '도움은 미리 보여주지 말고 필요한 순간에 보여주세요.']
      ]
    ]
  },
  {
    id: 'd2', dummy: true, src: 'nng', topic: 'process', sourceLine: 'NN/g', date: '2026.11.02', url: 'https://www.nngroup.com/',
    titleKo: '디자인 시스템은 라이브러리가 아니라 제품이다',
    titleEn: 'Your design system is a product, not a library',
    summary: '디자인 시스템을 컴포넌트 모음이 아니라 사용자와 로드맵이 있는 제품으로 운영해야 하는 이유를 정리한 글이에요.',
    insights: [
      { title: '디자인 시스템에도 사용자가 있고, 그 사용자는 디자이너와 개발자입니다.', body: '쓰는 사람이 무엇을 어려워하는지 듣지 않으면 컴포넌트가 아무리 많아도 채택되지 않습니다.' },
      { title: '배포 후의 유지보수가 진짜 일입니다.', body: '버전, 변경 내역, 폐기 계획이 없는 시스템은 몇 달 안에 팀이 우회하는 대상이 됩니다.' },
      { title: '채택률이 품질의 가장 정직한 지표입니다.', body: '얼마나 많은 화면이 시스템을 쓰는지, 예외가 어디서 생기는지를 꾸준히 측정해야 합니다.' },
    ],
    quotes: [
      { en: 'A library is something you ship. A product is something you keep improving.', ko: '라이브러리는 내보내는 것이고, 제품은 계속 개선하는 것입니다.' },
      { en: 'If nobody uses it, it is not a system.', ko: '아무도 쓰지 않는다면 그것은 시스템이 아닙니다.' },
    ],
    actions: [
      '우리 디자인 시스템을 쓰는 사람 세 명에게 가장 불편한 점을 물어보기',
      '최근 한 달 동안 시스템 밖에서 새로 만든 컴포넌트 목록을 뽑아보기',
    ],
    paras: [
      { h: ['Treat it like a product', '제품처럼 다루기'] },
      [
        ['A design system needs a roadmap, owners, and a feedback loop.', '디자인 시스템에는 로드맵과 담당자, 피드백 순환이 필요합니다.'],
        ['Adoption is the metric that tells you whether it works.', '채택률은 시스템이 제대로 작동하는지 알려 주는 지표입니다.']
      ]
    ]
  },
  {
    id: 'd3', dummy: true, src: 'nng', topic: 'process', sourceLine: 'NN/g', date: '2026.11.01', url: 'https://www.nngroup.com/',
    titleKo: '핸드오프의 끝, 함께 만드는 초안의 시대',
    titleEn: 'Handoffs are dead. Long live the shared draft',
    summary: '디자인을 완성해서 넘기는 핸드오프 대신, 디자이너와 개발자가 초안을 함께 다듬는 방식으로 옮겨 가야 한다는 글이에요.',
    insights: [
      { title: '완성본을 넘기는 순간 대화가 끊깁니다.', body: '핸드오프 뒤에 나온 질문과 예외는 대부분 비용이 큰 재작업이 됩니다.' },
      { title: '초안 단계에서 함께 보면 결정이 빨라집니다.', body: '기술 제약과 사용자 요구를 같은 화면에서 보면 합의에 드는 시간이 줄어듭니다.' },
      { title: '공유하는 초안은 완벽할 필요가 없습니다.', body: '거칠어도 모두가 고칠 수 있는 상태가 완성도 높은 파일보다 더 많은 의견을 끌어냅니다.' },
    ],
    quotes: [
      { en: 'The handoff is not a finish line. It is where the real conversation should begin.', ko: '핸드오프는 결승선이 아니라, 진짜 대화가 시작되어야 하는 지점입니다.' },
      { en: 'A rough draft everyone can edit beats a polished file nobody dares to touch.', ko: '모두가 고칠 수 있는 거친 초안이, 아무도 건드리지 못하는 잘 다듬은 파일보다 낫습니다.' },
    ],
    actions: [
      '다음 기능은 디자인이 끝나기 전에 개발자를 초안 리뷰에 초대해 보기',
      '핸드오프 이후에 나온 질문을 모아서 어느 단계에서 물었어야 했는지 표시해 보기',
    ],
    paras: [
      { h: ['From handoff to shared draft', '핸드오프에서 공유 초안으로'] },
      [
        ['Invite engineers into the draft while decisions are still cheap.', '결정에 드는 비용이 아직 낮을 때 개발자를 초안에 초대하세요.'],
        ['Shared drafts turn review into collaboration.', '공유된 초안은 리뷰를 협업으로 바꿉니다.']
      ]
    ]
  }
];
