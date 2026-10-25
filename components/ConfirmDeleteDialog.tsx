"use client";

import { RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** 되돌릴 수 없는 삭제 전에 한 번 더 묻는 확인 다이얼로그. 문구는 모든 삭제에 공통이고, 삭제 버튼은 danger 색. */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-headline font-bold tracking-headline">삭제할까요?</DialogTitle>
            <DialogClose render={<Button variant="ghost" size="icon-sm" className="shrink-0 bg-secondary" />}>
              <RiCloseLine />
              <span className="sr-only">닫기</span>
            </DialogClose>
          </div>
          <DialogDescription className="text-body-md text-on-surface-muted">삭제하면 되돌릴 수 없어요.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row">
          <Button variant="secondary" size="lg" onClick={() => onOpenChange(false)} className="h-12 flex-1">
            취소
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="h-12 flex-1"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
