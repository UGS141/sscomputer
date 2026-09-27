import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAF9] px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-teal-100 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-orange-100 text-[#F97316] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#123B3A]">Something Went Wrong</h2>
              <p className="text-sm text-[#4B6B69]">
                The application encountered an unexpected error. Please refresh the page to reload the application.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-left overflow-x-auto text-xs font-mono text-red-600 max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#087F78] to-[#12A77A] text-white font-bold shadow-md hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
