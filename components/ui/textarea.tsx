import * as React from "react"
import { cn } from "@/lib/utils"

/** 여러 줄 입력. 포커스는 바깥 링 없이 테두리 색만 바뀐다. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "box-border w-full resize-none rounded-xl border border-border-strong bg-surface px-3.5 py-3 text-body-md text-on-surface outline-none placeholder:text-on-surface-muted focus:border-primary disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
