import { Component, type ErrorInfo, type ReactNode } from "react";
import { msg } from "../i18n";
import { m } from "../i18n/messages/errorBoundary";

type State = { error: Error | null };

/** Red de seguridad: si un componente falla, se muestra un aviso en lugar de una pantalla en blanco. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const t = msg(m);
    return (
      <main className="crash" role="alert">
        <h1>{t.title}</h1>
        <p>{t.text}</p>
        <button className="btn btn--primary" onClick={() => location.reload()}>
          {t.reload}
        </button>
        <details>
          <summary>{t.details}</summary>
          <pre>{error.message}</pre>
        </details>
      </main>
    );
  }
}
