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
  }
];
