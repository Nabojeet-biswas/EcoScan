import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva("badge w-fit shrink-0", {
  variants: {
    variant: {
      default: "badge-default",
      success: "badge-success",
      warning: "badge-warning",
      danger: "badge-danger",
      info: "badge-info",
      ai: "badge-ai",
    },
    size: {
      sm: "badge-sm",
      md: "",
      lg: "badge-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean
    pulse?: boolean
  }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          badgeVariants({ variant, size }),
          dot && "badge-dot",
          pulse && "animate-pulse-ring",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge }
