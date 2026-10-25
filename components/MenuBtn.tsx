/** 어두운 팝오버 메뉴 안의 버튼 한 칸. 아이콘 + 라벨. */
export function MenuBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 items-center gap-2 border-0 bg-transparent px-3 text-label-md font-medium text-on-primary"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
