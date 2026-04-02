import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  scanIn?: boolean;
}

export function CyberCard({ children, className, scanIn = false, ...props }: CyberCardProps) {
  return (
    <div
      className={cn(
        "cyber-card glass rounded-sm p-4",
        scanIn && "scan-in",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
