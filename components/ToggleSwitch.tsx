/** 켜짐/꺼짐 표시만 그리는 토글. 눌림 처리는 감싸는 role="switch" 버튼이 맡는다. */
export function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative block h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-subtle"
      }`}
    >
      <span
        className={`absolute top-0.5 block size-[18px] rounded-full bg-surface transition-[left] ${
          on ? "left-[18px]" : "left-0.5"
        }`}
      />
    </span>
  );
}
