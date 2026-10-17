import React from 'react';

/**
 * Reach International Operations - Application Error Boundary
 * Prevents full-screen crashes and provides clean, high-contrast fallback with retry action.
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary caught error]:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return typeof this.props.fallback === 'function' 
                    ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
                    : this.props.fallback;
            }

            return (
                <div className="flex-1 w-full min-h-[320px] flex items-center justify-center p-6 bg-slate-50">
                    <div className="bg-white border border-border-light rounded-2xl shadow-card p-6 sm:p-8 max-w-md w-full text-center">
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mb-4 text-xl">
                            ⚠️
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                            {this.props.title || 'Something went wrong'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 mb-6">
                            {this.props.message || 'An unexpected error occurred while rendering this view. Please try reloading or resetting.'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={this.handleReset}
                                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-theme-breakdown hover:bg-blue-700 active:scale-95 rounded-xl transition-all cursor-pointer shadow-xs"
                            >
                                Try Again
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-border-light hover:bg-slate-50 active:scale-95 rounded-xl transition-all cursor-pointer shadow-2xs"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
