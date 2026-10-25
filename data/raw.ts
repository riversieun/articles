// 콘텐츠 데이터. 문단은 [영어, 한국어] 문장 쌍의 배열이고, 소제목은 { h: [영어, 한국어] } 로 문단 사이에 둔다.
// 문장 안의 [[표현|키]] 는 운영자가 지정한 주요 영어 표현을 뜻한다. 영어 제목은 첫 글자만 대문자로 적어도 화면에서 Title Case로 바뀐다.
import type { RawArticle } from "@/lib/types";

export const RAW: RawArticle[] = [
  {
    // 진짜 아티클 1호 (테스트). 원문: Figma Blog. 번역·요약·표현은 AI 초안이며 운영자 검수 전.
    id: 'r1', src: 'figma', topic: 'process', sourceLine: 'Figma', date: '2026.05.23', url: 'https://www.figma.com/blog/what-matters-when-anyone-can-build/',
    titleKo: '누구나 만들 수 있을 때, 무엇이 중요한가',
    titleEn: 'What matters when anyone can build',
    summary: 'AI로 누구나 프로덕트를 만들 수 있게 되면, 진짜 경쟁력은 무엇을 출시할 가치가 있는지 아는 것이라는 글입니다. 첫 아이디어에 매달리지 말고 여러 방향을 넓게, 그리고 깊게 탐색해 만들 가치가 있는 것을 고르라고 합니다. 또 AI가 내놓는 평범한 기본값을 의심하고 끈질기게 다듬는 craft가 눈에 띄는 결과물을 만든다고 말합니다.',
    x: {
      x1: ['worth building', '만들 가치가 있는', 'be worth -ing는 "~할 가치가 있다"는 뜻입니다. worth reading, worth shipping처럼 씁니다.'],
      x2: ['worth shipping', '출시할 가치가 있는', 'ship은 제품을 "내놓다, 출시하다"라는 뜻으로 업계에서 흔히 씁니다.'],
      x3: ['craft', '정성 들여 다듬는 솜씨', '결과물을 세심하게 다듬는 기술과 태도입니다. 타고난 취향(taste)이 아니라 반복해서 다듬는 과정을 가리킵니다.'],
      x4: ['hill-climbing', '국소적으로 개선만 거듭하는 것', '현재 위치에서 더 나은 쪽으로만 움직이다 가까운 꼭대기(국소 최적점)에 갇히는 탐색 방식입니다. 처음 아이디어만 계속 개선하는 상황을 비유합니다.'],
      x5: ['stand out', '눈에 띄다, 돋보이다', 'stand out from the crowd(무리 속에서 돋보이다)처럼 씁니다. 명사형은 standout입니다.']
    },
    paras: [
      [
        ['If AI can make anyone a product builder, the real edge is knowing what’s [[worth shipping|x2]].', 'AI가 누구나 프로덕트를 만드는 사람으로 만들어 준다면, 진짜 경쟁력은 무엇을 출시할 가치가 있는지 아는 것입니다.']
      ],
      { h: ['Choosing what’s worth building', '무엇을 만들 가치가 있는지 고르기'] },
      [
        ['Figuring out what’s actually [[worth building|x1]] isn’t obvious.', '무엇이 정말 만들 가치가 있는지 알아내는 일은 쉽지 않습니다.'],
        ['The space of possibilities is vast, and navigating it is as much art as method.', '가능성의 영역은 넓고, 그 안에서 길을 찾는 일은 방법만큼이나 감각의 영역이기도 합니다.'],
        ['A common trap, especially for newer builders, is latching onto the first idea and going deep.', '특히 초보 빌더에게 흔한 함정은 처음 떠오른 아이디어에 매달려 깊이 파고드는 것입니다.'],
        ['You refine, iterate, improve, but often you’re just [[hill-climbing|x4]] locally, making path-dependent decisions without ever questioning the starting point.', '다듬고, 반복하고, 개선하지만, 사실은 출발점을 한 번도 의심하지 않은 채 앞선 선택에 얽매인 결정을 내리며 국소적으로 hill-climbing만 하고 있는 경우가 많습니다.']
      ],
      [
        ['The better way, the way you actually find the right idea, is to go broad and deep at the same time.', '더 나은 방법, 즉 올바른 아이디어를 실제로 찾는 방법은 넓게, 그리고 동시에 깊게 파고드는 것입니다.'],
        ['AI now makes it possible to explore multiple directions in parallel while pushing each far enough to feel real.', '이제 AI 덕분에 여러 방향을 병렬로 탐색하면서도, 각각을 실감 날 만큼 충분히 밀어붙일 수 있습니다.'],
        ['Instead of choosing one path, you generate several distinct directions and develop each into something concrete: not just ideas, but end-to-end experiences.', '하나의 길을 고르는 대신 서로 다른 여러 방향을 만들고, 각각을 구체적인 결과물로 발전시킵니다. 아이디어에 그치지 않고, 처음부터 끝까지 이어지는 경험으로 말입니다.']
      ],
      { h: ['Making it yours', '나만의 것으로 만들기'] },
      [
        ['Choosing the right direction gets you to something [[worth building|x1]].', '올바른 방향을 고르면 만들 가치가 있는 무언가에 다다릅니다.'],
        ['But when anyone can build and build quickly, everything drifts toward what’s typical, making “good enough” both easy to reach and easy to accept.', '하지만 누구나 빠르게 만들 수 있는 시대에는 모든 것이 평범한 쪽으로 쏠리고, “이 정도면 충분하다”는 수준에 도달하기도, 받아들이기도 쉬워집니다.'],
        ['AI will produce something that looks right at a glance, following patterns that are statistically likely to work but rarely deeply considered.', 'AI는 언뜻 보기에 그럴듯한 결과물을 내놓지만, 이는 통계적으로 잘 작동할 가능성이 높은 패턴을 따를 뿐 깊이 고민한 결과인 경우는 드뭅니다.'],
        ['If you don’t question them, those defaults quietly become your product.', '이런 기본값을 의심하지 않으면, 그것이 조용히 여러분의 프로덕트가 됩니다.'],
        ['The result is a sea of products that feel interchangeable.', '그 결과는 서로 바꿔 써도 될 것 같은 프로덕트의 바다입니다.'],
        ['And when everything works, people choose what feels intentional, what feels cared for.', '그리고 모든 것이 제대로 작동할 때, 사람들은 의도가 느껴지고 정성이 느껴지는 것을 선택합니다.']
      ],
      [
        ['But [[craft|x3]] is what separates the memorable from the merely functional.', '하지만 기억에 남는 것과 그저 기능만 하는 것을 가르는 것은 craft입니다.'],
        ['It’s active: choosing, not accepting.', 'craft는 능동적인 일입니다. 받아들이는 것이 아니라 선택하는 것입니다.'],
        ['Revisiting and interrogating each decision, refining, removing, tightening, pushing past the first few versions until the work has a point of view.', '각 결정을 다시 살펴보고 따져 묻고, 다듬고, 덜어내고, 조이면서, 작업이 자기만의 관점을 갖출 때까지 처음 몇 버전을 넘어 밀고 나가는 것입니다.'],
        ['This isn’t about innate taste, but about exercising it through iteration, looking again, asking “is this actually right?”, and then making it so.', '이는 타고난 취향의 문제가 아니라, 반복을 통해 취향을 발휘하는 문제입니다. 다시 들여다보고, “이게 정말 맞는가?”를 묻고, 그렇게 되도록 만드는 것입니다.']
      ],
      [
        ['As the baseline improves, the average will look increasingly polished.', '기준선이 올라갈수록 평균적인 결과물은 점점 더 세련돼 보일 것입니다.'],
        ['Standing out won’t come from tools or speed, but from how much care you’re willing to put in.', '눈에 띄는 것은 도구나 속도에서 나오지 않고, 얼마나 정성을 들이려 하는가에서 나옵니다.'],
        ['In that world, the only way to [[stand out|x5]] is to go further than what’s given and make something unmistakably yours.', '그런 세상에서 돋보이는 유일한 방법은 주어진 것 이상으로 더 나아가, 분명히 나만의 것이라고 할 만한 무언가를 만드는 것입니다.']
      ],
      { h: ['What matters now', '지금 중요한 것'] },
      [
        ['Speed, direction, and [[craft|x3]].', '속도, 방향, 그리고 craft입니다.']
      ],
      [
        ['The best teams don’t trade these off—they move quickly, choose deliberately, and refine relentlessly.', '최고의 팀은 이 셋을 맞바꾸지 않습니다. 빠르게 움직이고, 신중하게 선택하고, 끈질기게 다듬습니다.'],
        ['That’s what it takes to build something that actually [[stands out|x5]].', '그렇게 해야 정말로 눈에 띄는 무언가를 만들 수 있습니다.'],
        ['Because when anything can be built, the only edge is in what you choose and how well you shape it.', '무엇이든 만들 수 있는 시대에는, 유일한 우위가 무엇을 선택하고 그것을 얼마나 잘 빚어내는가에 있기 때문입니다.']
      ]
    ]
  }
];
