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

export const metadata: Metadata = { title: "Design System" };

const BUTTON_VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link", "accent"] as const;
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;
const BADGE_VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const;

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-5 border-t border-line pt-8">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-xl font-bold tracking-[-0.02em]">{title}</h2>
        {note && <p className="m-0 text-[13px] leading-normal text-sub">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="m-0 text-[12.5px] font-bold text-sub">{label}</h3>
      {children}
    </div>
  );
}

const row = "flex flex-wrap items-center gap-2";

export default function DesignSystemPage() {
  return (
    <main className="flex flex-col gap-8 px-5 pt-8 pb-16">
      <header className="flex flex-col gap-2">
        <h1 className="m-0 text-[28px] leading-[1.15] font-bold tracking-[-0.03em]">Design System</h1>
        <p className="m-0 text-sm leading-[1.6] text-sub">
          shadcn/ui(Base UI, 프리셋 b2D2mxv2w)로 추가한 컴포넌트를 variant와 상태별로 모았습니다. 호버·포커스·눌림은 직접
          눌러서 확인하세요.
        </p>
        <nav aria-label="컴포넌트" className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] font-semibold">
          {["button", "input", "card", "badge", "dialog"].map((id) => (
            <a key={id} href={`#${id}`} className="underline underline-offset-4">
              {id}
            </a>
          ))}
        </nav>
      </header>

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
                  <DialogTitle>기록을 백업할까요?</DialogTitle>
                  <DialogDescription>구글 로그인으로 연결하면 다른 기기에서도 이어 볼 수 있어요.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>나중에 할게요</DialogClose>
                  <DialogClose render={<Button />}>백업하기</DialogClose>
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
    </main>
  );
}
