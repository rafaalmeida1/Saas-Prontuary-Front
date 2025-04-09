import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  textClassName?: string;
  style?: 'spinner' | 'dots';
  fullScreen?: boolean;
};

const loadingSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function Loading({
  size = 'md',
  text,
  className,
  textClassName,
  style = 'spinner',
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullScreen && 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
      className
    )}>
      {style === 'spinner' ? (
        <Loader2 className={cn('animate-spin text-primary', loadingSizes[size])} />
      ) : (
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      
      {text && (
        <p className={cn('text-center text-sm text-muted-foreground', textClassName)}>
          {text}
        </p>
      )}
    </div>
  );

  return content;
}

// Page loader with full screen backdrop
export function PageLoader({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg
              className="h-12 w-12 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

// LoadingPage component for page loading states
export function LoadingPage({ text = 'Carregando página...' }: { text?: string }) {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg
            className="h-12 w-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{text}</p>
    </div>
  );
}

// LoadingCard component for card loading states
export function LoadingCard({ text = 'Carregando dados...' }: { text?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

// Button loading component
export function ButtonLoading({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('mr-2 h-4 w-4 animate-spin', className)} />
  );
}

// Card loading skeleton
export function CardLoading() {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-[200px] rounded bg-muted animate-pulse" />
          <div className="h-4 w-[150px] rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Table loading skeleton for data tables
export function TableLoading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="w-full rounded-md border">
      <div className="border-b">
        <div className="flex h-10 items-center gap-4 px-4">
          <div className="h-4 w-[30%] rounded bg-muted animate-pulse" />
          <div className="h-4 w-[40%] rounded bg-muted animate-pulse" />
          <div className="h-4 w-[20%] rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div>
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className="flex h-16 items-center gap-4 border-b px-4">
            <div className="h-4 w-[30%] rounded bg-muted animate-pulse" />
            <div className="h-4 w-[40%] rounded bg-muted animate-pulse" />
            <div className="h-4 w-[20%] rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}