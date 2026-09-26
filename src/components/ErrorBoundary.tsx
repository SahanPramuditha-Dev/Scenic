import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error('Scenic rendering failed:', error); }
  render() {
    if (this.state.failed) return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] p-6 text-white"><h1 className="text-2xl font-semibold">Something went wrong</h1><p className="text-zinc-400">Reload Scenic to try again.</p><button onClick={() => window.location.reload()} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold">Reload</button></main>;
    return this.props.children;
  }
}
