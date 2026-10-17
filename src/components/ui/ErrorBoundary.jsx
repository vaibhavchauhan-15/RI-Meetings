import React from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from './Button.jsx';

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
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                            <AlertTriangle className="w-6 h-6 animate-pulse-subtle" />
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                            {this.props.title || 'Something went wrong'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 mb-6">
                            {this.props.message || 'An unexpected error occurred while rendering this view. Please try reloading or resetting.'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={this.handleReset}
                                leftIcon={<RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.reload()}
                                leftIcon={<RefreshCw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />}
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
