import * as React from "react"
import { ArrowRightIcon } from "lucide-react"

export const ArrowRight = React.forwardRef<
  React.ElementRef<typeof ArrowRightIcon>,
  React.ComponentPropsWithoutRef<typeof ArrowRightIcon>
>(({ className, ...props }, ref) => <ArrowRightIcon ref={ref} className={className} {...props} />)
ArrowRight.displayName = "ArrowRight"
