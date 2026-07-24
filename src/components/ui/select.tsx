'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

function SelectTrigger({ children, className, ...props }: any) {
  return <div className={cn('flex items-center justify-between', className)} {...props}>{children}</div>;
}
function SelectValue({ children, className, ...props }: any) {
  return <span className={cn('text-sm', className)} {...props}>{children}</span>;
}
function SelectContent({ children, className, ...props }: any) {
  return <div className={cn('', className)} {...props}>{children}</div>;
}
function SelectItem({ children, className, ...props }: any) {
  return <div className={cn('', className)} {...props}>{children}</div>;
}
