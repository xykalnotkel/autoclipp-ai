import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-[13px] font-[550] tracking-[-0.01em] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] h-10 px-6": variant === 'default',
            "bg-[#F5F5F0] text-[#0A0A0A] hover:bg-[#EBEBE6] h-10 px-6": variant === 'secondary',
            "border border-[#E8E8E3] bg-transparent hover:bg-[#F5F5F0] h-10 px-6": variant === 'outline',
            "hover:bg-[#F5F5F0] h-10 px-6": variant === 'ghost',
          },
          {
            "h-9 px-5 text-[12.5px]": size === 'sm',
            "h-11 px-8 text-[14px]": size === 'lg',
            "h-10 w-10": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
