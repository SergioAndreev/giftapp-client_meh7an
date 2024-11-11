import { ReactNode } from "react";

interface LoadingPlaceholderProps {
  count?: number;
  children: ReactNode;
  className?: string;
}

export const LoadingPlaceholder = ({
  count = 10,
  children,
  className = "",
}: LoadingPlaceholderProps) => (
  <div className={className}>
    {[...Array(count)].map((_, i) => (
      <div key={i}>{children}</div>
    ))}
  </div>
);
