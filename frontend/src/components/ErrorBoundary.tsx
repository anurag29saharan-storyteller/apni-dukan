import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-ink-50 px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-2xl">
              ⚠️
            </div>
            <h1 className="mt-4 text-xl font-bold text-ink-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}