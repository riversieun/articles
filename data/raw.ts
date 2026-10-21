// 프로토타입용 샘플 콘텐츠 (mock). 실제 원문이 아니며, 소스 표기는 UI 시안용입니다.
// 문장 안의 [[표현|키]] 는 운영자가 지정한 주요 영어 표현을 뜻합니다.
import type { RawArticle } from "@/lib/types";

export const RAW: RawArticle[] = [
  {
    id: 'a1', src: 'nng', sourceLine: 'NN/g · Hana Whitfield', date: '2026.10.08', url: 'https://www.nngroup.com/articles/',
    titleKo: '빈 화면은 오류가 아니라 첫인상이다',
    titleEn: 'Empty States Are a First Impression, Not an Error',
    summary: '빈 화면을 오류나 예외로 다루지 말고, 신규 사용자가 처음 만나는 제품 경험으로 설계하라는 글. 무엇이 들어갈 자리인지, 왜 중요한지, 다음에 무엇을 하면 되는지 세 가지를 갖추라고 제안한다.',
    x: {
      x1: ['edge case', '예외적인 상황, 드문 경우', '일반적인 흐름에서 벗어난 상황을 가리키는 제품·개발 용어.'],
      x2: ['left guessing', '추측하게 내버려진', 'leave someone guessing: 정보를 충분히 주지 않아 짐작하게 만들다.'],
      x3: ['drop off', '이탈하다, 중간에 떠나다', '퍼널의 특정 단계에서 사용자가 빠져나갈 때 쓴다. 명사는 drop-off.'],
      x4: ['dead end', '막다른 길', '더 나아갈 방법이 없는 상태. 화면에 다음 행동이 없을 때도 쓴다.'],
      x5: ['figure out', '알아내다, 파악하다', '생각하거나 시도해 본 끝에 이해하게 된다는 뉘앙스.']
    },
    paras: [
      [
        ['Most teams treat an empty screen as an [[edge case|x1]] and design it last.', '대부분의 팀은 빈 화면을 예외 상황으로 취급하고 가장 마지막에 디자인한다.'],
        ['But for a new user, that empty screen is the product.', '하지만 신규 사용자에게는 그 빈 화면이 곧 제품이다.']
      ],
      [
        ['A good empty state does three jobs: it explains what belongs here, shows why it matters, and offers one clear next step.', '좋은 빈 상태는 세 가지 일을 한다. 여기에 무엇이 들어가는지 설명하고, 왜 중요한지 보여주고, 분명한 다음 행동 하나를 제시한다.'],
        ['When any of the three is missing, people are [[left guessing|x2]], and guessing is where they [[drop off|x3]].', '셋 중 하나라도 빠지면 사람들은 추측할 수밖에 없고, 이탈은 바로 그 추측의 순간에 일어난다.']
      ],
      [
        ['Resist the urge to fill the space with a clever illustration and nothing else.', '재치 있는 일러스트 하나로 공간을 채우고 끝내고 싶은 유혹을 참아라.'],
        ['Decoration without direction is a [[dead end|x4]].', '방향 없는 장식은 막다른 길이다.'],
        ['The simplest test is to ask whether a first-time visitor could [[figure out|x5]] what to do in five seconds.', '가장 간단한 테스트는 처음 온 사람이 5초 안에 무엇을 해야 할지 알아낼 수 있는지 묻는 것이다.']
      ]
    ]
  },
  {
    id: 'a4', src: 'figma', sourceLine: 'X · Figma', date: '2026.10.06', url: 'https://x.com/figma',
    titleKo: '내일 누군가 이 파일을 연다고 생각하고 이름 짓기',
    titleEn: 'Name Your Layers Like Someone Will Open the File Tomorrow',
    summary: '핸드오프 전에 레이어 이름을 정리하자는 짧은 게시글. 명확한 이름이 개발자의 질문을 줄이고, 나중에 파일을 다시 열 자신에게도 도움이 된다는 내용이다.',
    x: {
      x1: ['handoff', '핸드오프, 작업물을 넘기는 일', '디자인을 개발 단계로 전달하는 과정. 동사는 hand off.'],
      x2: ['cut down on', '~을 줄이다', '양이나 횟수를 줄인다는 뜻. cut down on meetings처럼 쓴다.'],
      x3: ['pay off', '성과를 내다, 보답받다', '들인 노력이 나중에 좋은 결과로 돌아온다는 뜻.'],
      x4: ['change hands', '다른 사람에게 넘어가다', '소유자나 담당자가 바뀔 때 쓰는 표현.']
    },
    paras: [
      [
        ['A quick reminder before your next [[handoff|x1]].', '다음 핸드오프 전에 짧게 상기할 것 하나.'],
        ['Name your layers as if someone else will open the file tomorrow, because someone will.', '내일 다른 사람이 이 파일을 연다고 생각하고 레이어 이름을 지어라. 실제로 누군가는 열 테니까.']
      ],
      [
        ['Clear names [[cut down on|x2]] the questions developers have to ask.', '명확한 이름은 개발자가 물어봐야 하는 질문을 줄여준다.'],
        ['They also make your own file easier to return to after a month away.', '한 달 뒤에 돌아왔을 때 내 파일을 다시 파악하기도 쉬워진다.']
      ],
      [
        ['It takes a few extra seconds now and [[pays off|x3]] every time the file [[changes hands|x4]].', '지금은 몇 초 더 걸리지만, 파일이 다른 사람 손에 넘어갈 때마다 보답받는다.']
      ]
    ]
  },
  {
    id: 'a2', src: 'medium', sourceLine: 'Medium · Theo Marsh', date: '2026.10.02', url: 'https://medium.com/tag/product-design',
    titleKo: '지루한 인터페이스를 위한 변론',
    titleEn: 'The Case for Boring Interfaces',
    summary: '새로운 인터랙션보다 익숙한 패턴이 사용자의 주의를 과업에 쓰게 해준다는 주장. 새로움은 제품이 정말 차별화되는 한 곳에만 쓰자고 말한다.',
    x: {
      x1: ['reinvent the wheel', '이미 있는 것을 처음부터 다시 만들다', '검증된 해법이 있는데도 굳이 새로 만들 때 쓰는 관용구.'],
      x2: ['learning curve', '학습 곡선, 익숙해지는 데 드는 노력', 'steep learning curve는 배우기 어렵다는 뜻.'],
      x3: ['set apart', '차별화하다, 돋보이게 하다', 'set A apart (from B): A를 B와 구별되게 만들다.'],
      x4: ['think twice', '다시 생각하다, 망설이다', 'without thinking twice는 망설임 없이라는 뜻.']
    },
    paras: [
      [
        ['Every designer wants to [[reinvent the wheel|x1]] at least once.', '모든 디자이너는 적어도 한 번쯤은 바퀴를 다시 발명하고 싶어 한다.'],
        ['Users, on the other hand, just want the wheel to turn.', '반면 사용자는 그저 바퀴가 굴러가기를 바랄 뿐이다.']
      ],
      [
        ['Familiar patterns are not lazy; they let people spend their attention on the task instead of the interface.', '익숙한 패턴은 게으른 것이 아니다. 사람들이 인터페이스가 아니라 과업에 주의를 쓰게 해준다.'],
        ['A novel interaction has a [[learning curve|x2]], and someone has to pay for it.', '새로운 인터랙션에는 학습 곡선이 있고, 누군가는 그 비용을 치러야 한다.']
      ],
      [
        ['So spend your novelty budget where it truly [[sets you apart|x3]], and keep everything else boring.', '그러니 새로움에 쓸 예산은 정말로 차별화되는 곳에 쓰고, 나머지는 전부 지루하게 두어라.'],
        ['Boring, in this sense, is a compliment: it means nobody had to [[think twice|x4]].', '이런 의미에서 지루하다는 말은 칭찬이다. 아무도 두 번 생각할 필요가 없었다는 뜻이니까.']
      ]
    ]
  },
  {
    id: 'a6', src: 'lenny', kind: 'video', sourceLine: 'YouTube · Lenny\'s Podcast', date: '2026.09.30', url: 'https://www.youtube.com/@LennysPodcast',
    titleKo: '상대에게 닿는 디자인 피드백',
    titleEn: 'Giving Design Feedback That Lands',
    summary: '디자인 피드백이 실제로 받아들여지려면 어떻게 해야 하는지에 대한 대화 일부. 원하는 피드백의 범위를 먼저 묻고, 가장 중요한 한 가지에 집중하라고 말한다.',
    x: {
      x1: ['shut down', '마음을 닫다, 반응을 멈추다', '사람에게 쓰면 더 이상 대화나 피드백을 받아들이지 않게 된다는 뜻.'],
      x2: ['off the table', '논의 대상에서 제외된', '반대로 on the table은 검토 중이라는 뜻.'],
      x3: ['spell out', '분명하게 설명하다', '오해가 없도록 하나하나 풀어서 말한다는 뜻.'],
      x4: ['at the end of the day', '결국, 따지고 보면', '여러 사정을 고려한 뒤 결론을 말할 때 쓰는 회화 표현.']
    },
    paras: [
      [
        ['The worst feedback I ever gave was technically correct.', '제가 한 최악의 피드백은 기술적으로는 옳은 말이었어요.'],
        ['I listed twelve problems, and the designer [[shut down|x1]] after the third.', '문제를 열두 개 나열했는데, 디자이너는 세 번째쯤에서 마음을 닫아버렸죠.']
      ],
      [
        ['Now I start by asking what kind of feedback they are looking for, and what is already [[off the table|x2]].', '이제는 어떤 피드백을 원하는지, 그리고 무엇이 이미 논의 대상이 아닌지부터 묻습니다.'],
        ['Then I pick the one thing that matters most and [[spell out|x3]] why.', '그런 다음 가장 중요한 한 가지를 골라 왜 그런지 분명히 설명해요.'],
        ['Everything else can wait, or go in a written note.', '나머지는 나중에 해도 되고, 글로 남겨도 됩니다.']
      ],
      [
        ['Feedback is only useful if the other person can still hear it; [[at the end of the day|x4]], that is the whole job.', '피드백은 상대가 아직 들을 수 있을 때만 쓸모가 있어요. 결국 그게 이 일의 전부예요.']
      ]
    ]
  },
  {
    id: 'a3', src: 'hn', sourceLine: 'Hacker News · pixelnomad', date: '2026.09.28', url: 'https://news.ycombinator.com/',
    titleKo: '디자인 시스템은 조용히 무너진다',
    titleEn: 'Design Systems Fail Quietly',
    summary: '디자인 시스템은 한 번의 큰 사건이 아니라 그럴듯한 예외가 쌓이며 무너진다는 글. 문서보다 기본값과 이름, 잘못 쓰기 어려운 컴포넌트가 시스템을 지킨다고 본다.',
    x: {
      x1: ['overnight', '하룻밤 사이에, 갑자기', '변화가 아주 빠르게 일어날 때 부사나 형용사로 쓴다.'],
      x2: ['one-off', '일회성으로 만든 것', '재사용하지 않고 한 번만 쓰려고 만든 예외. 형용사로도 쓴다.'],
      x3: ['under pressure', '압박을 받는 상황에서', '시간이나 기대 때문에 쫓길 때 쓴다.'],
      x4: ['roll your own', '직접 만들어 쓰다', '기존 도구를 쓰지 않고 스스로 만든다는 개발자 표현.']
    },
    paras: [
      [
        ['A design system rarely collapses [[overnight|x1]].', '디자인 시스템이 하룻밤 사이에 무너지는 일은 드물다.'],
        ['It erodes one exception at a time, each of them reasonable on its own.', '예외가 하나씩 쌓이면서 침식되는데, 예외 하나하나는 따로 보면 다 그럴 만하다.']
      ],
      [
        ['Someone needs a slightly different button, the deadline is tight, and a [[one-off|x2]] ships.', '누군가는 조금 다른 버튼이 필요하고, 마감은 촉박하고, 결국 일회성 컴포넌트가 배포된다.'],
        ['Documentation will not save you, because nobody reads it [[under pressure|x3]].', '문서는 당신을 구해주지 못한다. 압박을 받는 상황에서는 아무도 문서를 읽지 않기 때문이다.']
      ],
      [
        ['What saves you is making the right thing the easiest thing: sensible defaults, good names, and components that are hard to misuse.', '당신을 구하는 건 옳은 방식을 가장 쉬운 방식으로 만드는 것이다. 합리적인 기본값, 좋은 이름, 그리고 잘못 쓰기 어려운 컴포넌트.'],
        ['If the system is harder than [[rolling your own|x4]], people will roll their own.', '시스템을 쓰는 게 직접 만드는 것보다 어렵다면, 사람들은 직접 만들 것이다.']
      ]
    ]
  },
  {
    id: 'a5', src: 'figma', sourceLine: 'LinkedIn · Figma', date: '2026.09.25', url: 'https://www.linkedin.com/company/figma/',
    titleKo: '프로토타입은 답이 아니라 질문이다',
    titleEn: 'A Prototype Is a Question, Not an Answer',
    summary: '프로토타입은 완성품의 축소판이 아니라 사람들에게 던지는 질문이라는 게시글. 얼마나 다듬을지보다 무엇을 배울지를 먼저 정하라고 조언한다.',
    x: {
      x1: ['put in front of', '~앞에 내놓다, 보여주다', 'put A in front of users: 사용자에게 직접 보여주고 반응을 본다.'],
      x2: ['polished', '다듬어진, 완성도 높은', '마감이 매끈한 결과물에 쓴다. 반대 느낌은 rough.'],
      x3: ['overkill', '과잉, 필요 이상인 것', '목적에 비해 지나치게 많은 노력이나 기능을 가리킨다.']
    },
    paras: [
      [
        ['A prototype is not a smaller version of the final product.', '프로토타입은 최종 제품의 축소판이 아니다.'],
        ['It is a question you can [[put in front of|x1]] real people.', '실제 사람들 앞에 내놓을 수 있는 질문이다.']
      ],
      [
        ['The rougher it looks, the more honest the feedback tends to be, because nobody feels bad about criticizing a sketch.', '거칠어 보일수록 피드백은 더 솔직해지는 경향이 있다. 스케치를 비판하는 걸 미안해하는 사람은 없기 때문이다.'],
        ['So decide what you want to learn before you decide how [[polished|x2]] it should be.', '그러니 얼마나 다듬을지 정하기 전에 무엇을 배우고 싶은지부터 정하라.']
      ],
      [
        ['If a paper sketch can answer the question, building more is just [[overkill|x3]].', '종이 스케치로 답할 수 있는 질문이라면, 그 이상 만드는 건 과잉일 뿐이다.']
      ]
    ]
  }
];
