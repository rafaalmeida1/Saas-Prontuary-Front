import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;
      
      // Handle ApiError specifically
      if (error instanceof ApiError) {
        return (
          <div className="p-6 max-w-md mx-auto">
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>
                {error.status === 401 || error.status === 403
                  ? 'Authentication Error'
                  : error.status >= 500
                  ? 'Server Error'
                  : 'Error'}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">{error.message}</p>
                <p className="text-xs opacity-70">Error code: {error.errorCode}</p>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col space-y-2 mt-4">
              {(error.status === 401 || error.status === 403) ? (
                <Link href="/login">
                  <Button className="w-full">
                    Go to Login
                  </Button>
                </Link>
              ) : (
                <>
                  <Button onClick={this.resetErrorBoundary} variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Link href="/">
                    <Button variant="ghost" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Return to Home
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        );
      }

      // Generic error fallback
      return (
        <div className="p-6 max-w-md mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {error?.message || 'An unexpected error occurred.'}
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-4 mt-4">
            <Button onClick={this.resetErrorBoundary} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="ghost" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

// Hook version for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'> = {}
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const ComponentWithErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return ComponentWithErrorBoundary;
} 