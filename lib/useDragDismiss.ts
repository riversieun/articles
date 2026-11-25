import { useRef, type PointerEvent as RPointerEvent } from "react";
import { flushSync } from "react-dom";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * 아래로 끌어서 닫는 시트용 제스처 (motion-lab 에서 B안으로 확정).
 * - 누르는 동안은 손가락과 1:1(transition 없음, transform 직접 기록, React state 없음).
 * - 위로 끌면 20%만 따라오는 고무줄.
 * - 놓을 때 40% 이상 내렸거나 빠르게 튕기면(0.5px/ms) 닫힘. 닫힐 땐 놓은 속도로 남은 거리를 달리고(160~320ms), 아니면 320ms로 제자리.
 * - 어두운 배경은 끌린 만큼 같이 옅어진다(한 값에서 파생).
 * 버튼·입력창·[data-no-drag] 위에서 시작한 누름은 끌기로 보지 않는다.
 */
export function useDragDismiss(onDismiss: () => void) {
  const surface = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLButtonElement>(null);
  const d = useRef({ on: false, y0: 0, y: 0, ly: 0, lt: 0, v: 0, id: -1, h: 1 });

  const clear = () => {
    for (const el of [surface.current, backdrop.current]) {
      if (!el) continue;
      el.style.transition = "";
      el.style.transform = "";
      el.style.opacity = "";
    }
  };

  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a, textarea, input, select, [data-no-drag]")) return;
    // md(768px) 이상에서는 시트가 가운데 모달이라 끌어 닫기를 쓰지 않는다(바깥·닫기 버튼·Esc로 닫음)
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const el = surface.current;
    if (!el || !backdrop.current) return;
    d.current = { on: true, y0: e.clientY, y: 0, ly: e.clientY, lt: e.timeStamp, v: 0, id: e.pointerId, h: el.offsetHeight };
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* 활성 포인터가 없으면 캡처 없이 진행 */
    }
    el.style.transition = "none";
    backdrop.current.style.transition = "none";
  };

  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const s = d.current;
    if (!s.on || e.pointerId !== s.id) return;
    const dy = e.clientY - s.y0;
    s.y = dy > 0 ? dy : dy * 0.2;
    const dt = Math.max(1, e.timeStamp - s.lt);
    s.v = 0.7 * s.v + 0.3 * ((e.clientY - s.ly) / dt);
    s.ly = e.clientY;
    s.lt = e.timeStamp;
    surface.current!.style.transform = `translateY(${s.y}px)`;
    backdrop.current!.style.opacity = String(Math.max(0, 1 - Math.max(0, s.y) / s.h));
  };

  const up = (e: RPointerEvent<HTMLDivElement>) => {
    const s = d.current;
    if (!s.on || e.pointerId !== s.id) return;
    s.on = false;
    const el = surface.current!;
    const bg = backdrop.current!;
    if (s.y > s.h * 0.4 || s.v > 0.5) {
      const dur = Math.min(320, Math.max(160, (s.h - s.y) / Math.max(s.v, 0.9)));
      el.style.transition = `transform ${dur}ms ${EASE}`;
      bg.style.transition = `opacity ${dur}ms ease-out`;
      el.style.transform = `translateY(${s.h}px)`;
      bg.style.opacity = "0";
      window.setTimeout(() => {
        flushSync(onDismiss);
        clear();
      }, dur);
    } else {
      el.style.transition = `transform 320ms ${EASE}`;
      bg.style.transition = "opacity 320ms ease-out";
      el.style.transform = "translateY(0)";
      bg.style.opacity = "1";
      window.setTimeout(clear, 330);
    }
  };

  return { surface, backdrop, bind: { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up } };
}
