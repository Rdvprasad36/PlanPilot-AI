import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#F7F5FF]">
          <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-[#B3261E]">Something went wrong</h2>
            <p className="text-sm text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred in the application.'}
            </p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
