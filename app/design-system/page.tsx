import type { Metadata } from "next";
import { RiAddLine, RiArrowRightLine, RiBookmarkLine, RiCheckLine, RiDeleteBinLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ServiceDemos } from "./demos";

export const metadata: Metadata = { title: "Design System" };

const BUTTON_VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link", "accent"] as const;
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;
const BADGE_VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const;

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-5 border-t border-border pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-headline font-bold tracking-headline">{title}</h2>
        {note && <p className="m-0 text-body-sm text-on-surface-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="m-0 text-label-md font-semibold text-on-surface-muted">{label}</h3>
      {children}
    </div>
  );
}

const COLORS: [name: string, hex: string, token: string, hint: string][] = [
  ["primary", "#111111", "--ds-primary", "글자·기본 버튼"],
  ["accent", "#D9F25C", "--ds-accent", "라임. 핵심 행동·진행 바"],
  ["accent-sub", "#E7E0FF", "--ds-accent-sub", "사용자 하이라이트"],
  ["accent-sub-strong", "#CBBCFF", "--ds-accent-sub-strong", "코멘트 말풍선"],
  ["surface", "#FFFFFF", "--ds-surface", "페이지·팝업"],
  ["surface-muted", "#F4F4F6", "--ds-surface-muted", "카드·뱃지·보조 버튼"],
  ["on-surface-muted", "#5F5F66", "--ds-on-surface-muted", "읽는 글자의 약한 단계"],
  ["subtle", "#8E8E96", "--ds-subtle", "글자 금지. 토글 꺼짐 등 장식"],
  ["border", "#E7E7EA", "--ds-border", "일반 구분선"],
  ["border-strong", "#D5D5DA", "--ds-border-strong", "입력창·카드 안 구분선"],
  ["danger", "oklch(0.577 0.245 27.325)", "--ds-danger", "삭제·오류만"],
];

const TYPE: [name: string, cls: string, spec: string, sample: string][] = [
  ["display", "text-display font-bold tracking-display", "28 / 700 / 1.2", "Empty States Are a First Impression"],
  ["headline", "text-headline font-bold tracking-headline", "20 / 700 / 1.4", "내 생각"],
  ["body-lg", "text-body-lg", "18 / 400 / 1.6", "Most teams treat an empty screen as an edge case."],
  ["body-lg-semibold", "text-body-lg font-semibold", "18 / 600 / 1.6", "left guessing"],
  ["body-md", "text-body-md", "16 / 400 / 1.6", "빈 화면은 오류가 아니라 첫인상이다"],
  ["body-md-semibold", "text-body-md font-semibold", "16 / 600 / 1.6", "예외적인 상황, 드문 경우"],
  ["body-sm", "text-body-sm", "14 / 400 / 1.6", "일반적인 흐름에서 벗어난 상황을 가리키는 제품·개발 용어."],
  ["label-md", "text-label-md font-medium", "14 / 500", "원문 읽기"],
  ["label-md-semibold", "text-label-md font-semibold", "14 / 600", "원문 요약"],
  ["label-sm", "text-label-sm font-medium", "12 / 500", "디자인 프로세스"],
];

const RADII: [name: string, cls: string, px: string][] = [
  ["sm", "rounded-sm", "6"],
  ["md", "rounded-md", "8"],
  ["lg", "rounded-lg", "10"],
  ["xl", "rounded-xl", "14"],
  ["card", "rounded-card", "16"],
  ["pill", "rounded-pill", "26"],
  ["full", "rounded-full", "∞"],
];

const SPACES: [name: string, cls: string, px: string][] = [
  ["xs", "w-1", "4"],
  ["sm", "w-2", "8"],
  ["md", "w-3", "12"],
  ["lg", "w-4", "16"],
  ["xl", "w-6", "24"],
  ["2xl", "w-8", "32"],
  ["3xl", "w-20", "80"],
  ["page", "w-5", "20"],
];

const row = "flex flex-wrap items-center gap-2";

export default function DesignSystemPage() {
  return (
    <main className="flex flex-col gap-8 px-5 pt-8 pb-16">
      <header className="flex flex-col gap-2">
        <h1 className="m-0 text-display font-bold tracking-display">Design System</h1>
        <p className="m-0 text-body-sm text-on-surface-muted">
          DESIGN.md의 토큰(색·글자·모서리·간격)과 컴포넌트를 모았습니다. shadcn/ui(Base UI, 프리셋 b2D2mxv2w) 컴포넌트는
          variant와 상태별로, 서비스 전용 컴포넌트는 눌러서 확인하세요.
        </p>
        <nav aria-label="컴포넌트" className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-label-md font-semibold">
          {["colors", "typography", "radius-spacing", "button", "input", "card", "badge", "dialog", "service"].map((id) => (
            <a key={id} href={`#${id}`} className="underline underline-offset-4">
              {id}
            </a>
          ))}
        </nav>
      </header>

      <Section id="colors" title="Colors" note="역할 이름으로 부른다. 글자에는 subtle을 쓰지 않는다.">
        <div className="grid grid-cols-2 gap-2.5">
          {COLORS.map(([name, hex, token, hint]) => (
            <div key={name} className="flex items-center gap-3 rounded-card bg-surface-muted p-3">
              <span
                aria-hidden="true"
                className="size-10 shrink-0 rounded-lg border border-border"
                style={{ background: `var(${token})` }}
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-label-md font-semibold">{name}</span>
                <span className="text-label-sm text-on-surface-muted">{hex}</span>
                <span className="text-label-sm text-on-surface-muted">{hint}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="typography" title="Typography" note="크기·줄 높이는 text-* 클래스, 굵기·자간은 font-*·tracking-*를 함께 붙인다. Pretendard 하나만 쓴다.">
        <div className="flex flex-col">
          {TYPE.map(([name, cls, spec, sample]) => (
            <div key={name} className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0">
              <span className="text-label-sm text-on-surface-muted">
                {name} · {spec}
              </span>
              <span className={cls}>{sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="radius-spacing" title="Radius · Spacing" note="모서리는 rounded-* 클래스, 간격은 4px 단위 숫자 클래스(이름 대신 같은 값).">
        <Group label="radius">
          <div className="flex flex-wrap gap-3">
            {RADII.map(([name, cls, px]) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <span aria-hidden="true" className={`size-14 border border-border-strong bg-surface-muted ${cls}`} />
                <span className="text-label-sm text-on-surface-muted">
                  {name} {px}
                </span>
              </div>
            ))}
          </div>
        </Group>
        <Group label="spacing">
          <div className="flex flex-col gap-2">
            {SPACES.map(([name, cls, px]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-24 text-label-sm text-on-surface-muted">
                  {name} {px}
                </span>
                <span aria-hidden="true" className={`h-3 rounded-sm bg-accent-sub-strong ${cls}`} />
              </div>
            ))}
          </div>
        </Group>
      </Section>

      <Section id="button" title="Button" note="variant 6종 × size 4종, 아이콘 버튼, 아이콘 포함, 비활성.">
        <Group label="variant">
          <div className={row}>
            {BUTTON_VARIANTS.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
        </Group>
        <Group label="size (default / outline)">
          <div className={row}>
            {BUTTON_SIZES.map((s) => (
              <Button key={s} size={s}>
                {s}
              </Button>
            ))}
          </div>
          <div className={row}>
            {BUTTON_SIZES.map((s) => (
              <Button key={s} size={s} variant="outline">
                {s}
              </Button>
            ))}
          </div>
        </Group>
        <Group label="icon size">
          <div className={row}>
            {ICON_SIZES.map((s) => (
              <Button key={s} size={s} variant="outline" aria-label={`아이콘 ${s}`}>
                <RiAddLine />
              </Button>
            ))}
          </div>
        </Group>
        <Group label="with icon">
          <div className={row}>
            <Button>
              <RiAddLine data-icon="inline-start" />
              추가
            </Button>
            <Button variant="outline">
              다음
              <RiArrowRightLine data-icon="inline-end" />
            </Button>
            <Button variant="secondary">
              <RiBookmarkLine data-icon="inline-start" />
              저장
            </Button>
            <Button variant="destructive">
              <RiDeleteBinLine data-icon="inline-start" />
              삭제
            </Button>
          </div>
        </Group>
        <Group label="disabled">
          <div className={row}>
            {BUTTON_VARIANTS.map((v) => (
              <Button key={v} variant={v} disabled>
                {v}
              </Button>
            ))}
          </div>
        </Group>
      </Section>

      <Section id="input" title="Input" note="기본 / 값 있음 / 비활성 / 오류(aria-invalid) / type별.">
        <Group label="상태">
          <div className="flex flex-col gap-2.5">
            <Input placeholder="기본 (placeholder)" aria-label="기본" />
            <Input defaultValue="값이 있는 입력" aria-label="값 있음" />
            <Input placeholder="비활성" disabled aria-label="비활성" />
            <Input defaultValue="잘못된 값" aria-invalid="true" aria-label="오류" />
            <p className="m-0 -mt-1 text-xs text-destructive">올바른 형식으로 입력해 주세요.</p>
          </div>
        </Group>
        <Group label="type">
          <div className="flex flex-col gap-2.5">
            <Input type="email" placeholder="email" aria-label="email" />
            <Input type="password" defaultValue="password" aria-label="password" />
            <Input type="number" placeholder="number" aria-label="number" />
            <Input type="search" placeholder="search" aria-label="search" />
            <Input type="file" aria-label="file" />
          </div>
        </Group>
      </Section>

      <Section id="card" title="Card" note="기본 크기(default)와 작은 크기(sm), 액션·푸터 구성.">
        <Group label="default — header / action / content / footer">
          <Card>
            <CardHeader>
              <CardTitle>글 저장하기</CardTitle>
              <CardDescription>다시 읽고 싶은 글을 아카이브에 모아 둬요.</CardDescription>
              <CardAction>
                <Badge variant="secondary">NEW</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="m-0 leading-[1.7]">
                카드 본문 영역입니다. 제목·설명·액션은 헤더에, 본문은 content에, 버튼은 footer에 둡니다.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>확인</Button>
              <Button variant="outline">취소</Button>
            </CardFooter>
          </Card>
        </Group>
        <Group label="size sm">
          <Card size="sm">
            <CardHeader>
              <CardTitle>작은 카드</CardTitle>
              <CardDescription>여백이 줄어든 size=&quot;sm&quot;</CardDescription>
            </CardHeader>
            <CardContent>내용</CardContent>
          </Card>
        </Group>
        <Group label="content only">
          <Card size="sm">
            <CardContent>제목 없이 content만 있는 카드</CardContent>
          </Card>
        </Group>
      </Section>

      <Section id="badge" title="Badge" note="variant 6종, 아이콘 포함, 링크로 렌더링(render).">
        <Group label="variant">
          <div className={row}>
            {BADGE_VARIANTS.map((v) => (
              <Badge key={v} variant={v}>
                {v}
              </Badge>
            ))}
          </div>
        </Group>
        <Group label="with icon">
          <div className={row}>
            <Badge>
              <RiCheckLine data-icon="inline-start" />
              완료
            </Badge>
            <Badge variant="outline">
              <RiBookmarkLine data-icon="inline-start" />
              저장됨
            </Badge>
            <Badge variant="destructive">
              오류
              <RiDeleteBinLine data-icon="inline-end" />
            </Badge>
          </div>
        </Group>
        <Group label="as link (render)">
          <div className={row}>
            <Badge render={<a href="#badge" />} variant="secondary">
              링크 배지
            </Badge>
            <Badge render={<a href="#badge" />} variant="outline">
              outline 링크
            </Badge>
          </div>
        </Group>
      </Section>

      <Section id="dialog" title="Dialog" note="버튼을 눌러 열어 보세요. Base UI라 asChild 대신 render prop을 씁니다.">
        <Group label="기본 (확인 / 취소)">
          <div className={row}>
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>기본 다이얼로그</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>기록을 잃지 않게 로그인 해주세요</DialogTitle>
                  <DialogDescription>로그인하면 내 기록을 계속 남길 수 있어요.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>나중에 할게요</DialogClose>
                  <DialogClose render={<Button />}>로그인</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>입력 폼</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>피드백 보내기</DialogTitle>
                  <DialogDescription>불편한 점이나 아이디어를 적어 주세요.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2.5">
                  <Input placeholder="제목" aria-label="제목" />
                  <Input placeholder="이메일 (선택)" type="email" aria-label="이메일" />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
                  <Button>보내기</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Group>
        <Group label="위험 동작 / 닫기 버튼 없음 / 푸터 닫기">
          <div className={row}>
            <Dialog>
              <DialogTrigger render={<Button variant="destructive" />}>삭제 확인</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>코멘트를 삭제할까요?</DialogTitle>
                  <DialogDescription>삭제한 코멘트는 되돌릴 수 없어요.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
                  <DialogClose render={<Button variant="destructive" />}>삭제</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger render={<Button variant="secondary" />}>닫기 버튼 없음</DialogTrigger>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>우상단 X 없음</DialogTitle>
                  <DialogDescription>showCloseButton=&#123;false&#125; — 푸터 버튼이나 Esc로 닫아요.</DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton />
              </DialogContent>
            </Dialog>
          </div>
        </Group>
      </Section>

      <Section id="service" title="Service components" note="본문·아카이브·프로필에서 쓰는 서비스 전용 컴포넌트.">
        <ServiceDemos />
      </Section>
    </main>
  );
}
