import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import error from "../assets/illustrations/error.jpg";
import { IoIosRefresh } from "react-icons/io";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-col mb-10 items-center gap-6">
            <img draggable={false} className="w-100" src={error} alt="error-img" />

            <h1 className="text-4xl font-semibold">
              <span className="text-orange">Oops!</span> An error occurred.
            </h1>

            <button
              onClick={() => globalThis.location.reload()}
              className="bg-orange hover:bg-dark-orange flex cursor-pointer items-center gap-3 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
            >
              <IoIosRefresh size={20} /> Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
