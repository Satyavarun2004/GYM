import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-dark-bg p-10 text-center">
                    <div className="glass-card p-10 max-w-2xl border-red-500/20">
                        <h1 className="text-3xl font-black text-white mb-4">Something went wrong</h1>
                        <p className="text-dark-muted mb-6">
                            The application encountered an unexpected error. Check the console for details.
                        </p>
                        {this.state.error && (
                            <pre className="bg-black/40 p-4 rounded-xl text-left text-xs text-red-400 overflow-auto max-h-64 custom-scrollbar">
                                {this.state.error.toString()}
                                {'\n'}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary mt-8"
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

export default ErrorBoundary;
