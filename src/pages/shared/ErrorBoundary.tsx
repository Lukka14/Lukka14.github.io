import { Component, ErrorInfo, ReactNode } from "react";
import "./error-boundary.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors anywhere below it so a single throw cannot blank
 * the whole site. Without this, something as small as a malformed localStorage
 * entry read during render takes down every page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="app-error-screen">
        <div className="app-error-card">
          <img
            className="app-error-logo"
            src="/assets/movieplus-mark.svg"
            alt=""
            aria-hidden="true"
          />
          <h1>Something went wrong</h1>
          <p>
            The page ran into an unexpected problem. Reloading usually sorts it
            out.
          </p>
          <div className="app-error-actions">
            <button
              type="button"
              className="app-error-btn app-error-btn-primary"
              onClick={this.handleReload}
            >
              Reload the page
            </button>
            <button
              type="button"
              className="app-error-btn app-error-btn-ghost"
              onClick={this.handleGoHome}
            >
              Go to home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
