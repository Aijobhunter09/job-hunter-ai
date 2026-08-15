import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Application error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-primary-700 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">AI</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              An unexpected error occurred. Try reloading the page — your data is safe.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.hash = '/';
                window.location.reload();
              }}
              className="btn-primary"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
