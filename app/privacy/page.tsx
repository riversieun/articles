import type { Metadata } from "next";
import Link from "next/link";
import { IconBack } from "@/components/icons";

export const metadata: Metadata = {
  title: "개인정보처리방침 | crumbit",
  description: "crumbit이 수집하는 정보, 이용 목적, 보관 기간, 삭제 방법을 안내합니다.",
};

const EMAIL = "crumbit.articles.official@gmail.com";
const EFFECTIVE = "2026년 10월 27일";

const H2 = "m-0 text-body-md font-semibold text-on-surface";
const P = "m-0 text-body-sm text-on-surface";
const UL = "m-0 flex list-disc flex-col gap-1.5 pl-5 text-body-sm text-on-surface marker:text-on-surface-muted";

/**
 * 개인정보처리방침. 서비스가 실제로 하는 일만 적는다. (수집 항목은 lib/store.tsx·lib/remote.ts·lib/analytics.ts 기준)
 * 동작을 바꾸면(수집 항목, 외부 서비스, 보관 방식) 이 문서도 같이 고친다.
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-dvh pb-16">
      <div className="sticky top-0 z-30 flex h-14 items-center gap-1 bg-surface pr-5 pl-1">
        <Link
          href="/"
          aria-label="홈으로"
          className="flex size-11 items-center justify-center text-on-surface no-underline"
        >
          <IconBack />
        </Link>
        <h1 className="m-0 text-headline font-bold tracking-headline">개인정보처리방침</h1>
      </div>

      <main className="flex flex-col gap-8 px-5 pt-2">
        <div className="flex flex-col gap-2">
          <p className={P}>
            crumbit(이하 &ldquo;서비스&rdquo;)은 이용자의 개인정보를 소중하게 다루며, 「개인정보 보호법」 등 관련 법령을
            지킵니다. 이 방침은 서비스가 어떤 정보를 왜 수집하고, 얼마나 보관하며, 어떻게 지울 수 있는지 알려 드립니다.
          </p>
          <p className="m-0 text-body-sm text-on-surface-muted">시행일: {EFFECTIVE}</p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>1. 수집하는 정보</h2>
          <p className={P}>서비스는 이름이나 연락처를 받지 않고도 이용할 수 있습니다. 수집하는 정보는 아래와 같습니다.</p>
          <p className="m-0 text-body-sm font-medium text-on-surface">이용하는 동안 자동으로 만들어지는 정보</p>
          <ul className={UL}>
            <li>임의로 만들어진 이용자 번호(이름·이메일과 연결되지 않는 무작위 번호)</li>
            <li>브라우저·기기 정보(운영체제, 브라우저 종류, 화면 크기, 언어), IP 주소, 접속 시각</li>
            <li>
              서비스 이용 기록: 방문한 화면, 읽은 아티클, 번역 켜기·끄기, 하이라이트·코멘트·생각·글 저장의 추가와 삭제 여부,
              필터 선택, 피드백 전송 여부
            </li>
          </ul>
          <p className="m-0 text-body-sm font-medium text-on-surface">이용자가 직접 입력하는 정보</p>
          <ul className={UL}>
            <li>하이라이트한 문장, 코멘트와 생각의 내용, 저장한 글, 번역 설정</li>
            <li>피드백의 유형과 내용</li>
          </ul>
          <p className="m-0 text-body-sm font-medium text-on-surface">구글 로그인을 이용하는 경우</p>
          <ul className={UL}>
            <li>이메일 주소, 구글 프로필 이름, 프로필 사진 주소</li>
            <li>프로필 사진 이미지는 저장하지 않고, 구글이 제공하는 주소로 화면에만 표시합니다.</li>
            <li>구글 로그인을 제공하지 않는 동안에는 이 정보를 수집하지 않습니다.</li>
          </ul>
          <p className={P}>
            이용 현황 분석 도구에는 코멘트·생각·피드백의 내용을 보내지 않습니다. 이용 기록(어떤 기능을 썼는지)만 보냅니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>2. 이용 목적</h2>
          <ul className={UL}>
            <li>하이라이트·코멘트·저장한 글 등 이용자의 기록을 저장하고 다시 보여 주기 위해</li>
            <li>서비스 이용 현황을 분석하고 기능을 개선하기 위해</li>
            <li>피드백과 문의에 답하고 오류에 대응하기 위해</li>
            <li>부정한 이용을 막고 서비스를 안전하게 운영하기 위해</li>
          </ul>
          <p className={P}>
            운영자는 서비스 운영과 개선에 필요한 범위에서 이용자의 기록(코멘트 내용 포함)을 확인할 수 있으며, 다른
            이용자에게 공개하지 않습니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>3. 보관 기간</h2>
          <ul className={UL}>
            <li>
              <b className="font-semibold">로그인하지 않은 이용자:</b> 임의의 번호에 연결된 기록을 서비스를 운영하는 동안
              보관합니다. 오랫동안 이용하지 않은 기록은 정리(삭제)할 수 있습니다.
            </li>
            <li>
              <b className="font-semibold">구글 로그인 이용자:</b> 계정을 삭제할 때까지 보관합니다. 프로필의 &ldquo;계정
              삭제&rdquo;를 누르면 계정과 기록이 삭제됩니다.
            </li>
            <li>
              <b className="font-semibold">피드백:</b> 계정을 삭제해도 서비스 개선을 위해 의견 내용은 남을 수 있습니다. 이때
              작성자(이용자 번호)와의 연결은 끊습니다.
            </li>
            <li>관련 법령에서 일정 기간 보관하도록 정한 정보는 그 기간 동안 보관합니다.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>4. 이용자의 권리와 삭제 방법</h2>
          <p className={P}>
            이용자는 자신의 정보에 대해 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 요청은 아래 문의 이메일로
            보내 주시면 지체 없이 처리합니다.
          </p>
          <ul className={UL}>
            <li>구글 로그인 이용자는 프로필에서 직접 계정을 삭제할 수 있습니다.</li>
            <li>
              브라우저의 사이트 데이터를 지우면 이 기기에 저장된 기록의 사본은 지워지지만, 서버에 저장된 기록은 남아
              있습니다.
            </li>
            <li>
              로그인하지 않은 이용자의 기록은 이름·이메일과 연결되지 않은 임의의 번호로 저장돼 있어 운영자가 특정인의
              기록을 바로 가려내기 어렵습니다. 삭제를 원하시면 작성한 코멘트의 일부 내용, 작성 시기 등 기록을 확인할 수
              있는 정보를 함께 보내 주세요. 확인되는 범위에서 삭제합니다.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>5. 처리 위탁과 국외 이전</h2>
          <p className={P}>서비스를 운영하기 위해 아래 업체를 이용하며, 이용자의 정보가 해당 업체에서 처리·보관됩니다.</p>
          <ul className={UL}>
            <li>
              <b className="font-semibold">Supabase, Inc.</b> 데이터베이스 저장, 익명·구글 로그인 처리
            </li>
            <li>
              <b className="font-semibold">Vercel Inc.</b> 웹사이트 호스팅과 전송
            </li>
            <li>
              <b className="font-semibold">Google LLC</b> 구글 로그인(이용하는 경우)
            </li>
            <li>
              <b className="font-semibold">Mixpanel, Inc. / Amplitude, Inc.</b> 서비스 이용 현황 분석
            </li>
          </ul>
          <p className={P}>
            위 업체의 서버는 국외에 있을 수 있어, 1항의 정보가 서비스를 이용하는 시점에 국외로 전송되어 처리·보관될 수
            있습니다. 이전되는 국가와 업체별 보관 방식은 각 업체의 서비스 설정에 따르며, 궁금하신 점은 문의 이메일로
            알려 주시면 안내해 드립니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>6. 쿠키와 브라우저 저장소</h2>
          <p className={P}>
            서비스는 번역 설정, 이 기기에 둔 기록의 사본, 로그인 세션, 분석 도구의 식별자를 브라우저 저장소(로컬 스토리지,
            쿠키)에 저장합니다. 브라우저 설정에서 삭제하거나 차단할 수 있으나, 이 경우 기록이 이어지지 않는 등 일부
            기능이 제한될 수 있습니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>7. 안전성 확보 조치</h2>
          <ul className={UL}>
            <li>모든 통신은 암호화된 연결(HTTPS)로 이루어집니다.</li>
            <li>데이터베이스는 이용자 본인의 기록만 읽고 쓸 수 있도록 접근을 제한합니다.</li>
            <li>운영자의 접근은 필요한 범위로 제한합니다.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>8. 아동의 개인정보</h2>
          <p className={P}>서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 의도적으로 수집하지 않습니다.</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>9. 개인정보 보호 책임자와 문의</h2>
          <ul className={UL}>
            <li>운영자: crumbit</li>
            <li>
              문의 이메일:{" "}
              <a href={`mailto:${EMAIL}`} className="text-on-surface underline underline-offset-2">
                {EMAIL}
              </a>
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2}>10. 방침의 변경</h2>
          <p className={P}>
            이 방침의 내용이 바뀌면 이 페이지에 변경된 내용과 시행일을 알려 드립니다.
          </p>
        </section>
      </main>
    </div>
  );
}
