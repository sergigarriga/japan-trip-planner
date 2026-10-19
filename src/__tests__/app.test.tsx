// @vitest-environment jsdom
import axe from "axe-core";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { LANGS, setLang } from "../i18n";
import { TripProvider } from "../state";
import { installBrowserStubs } from "../test/browserStubs";

// Leaflet necesita un <canvas> real, que jsdom no tiene: el mapa se comprueba en el navegador (ver docs/TESTING.md).
vi.mock("../components/TripMap", () => ({ TripMap: () => <div className="tripmap" role="img" aria-label="map" /> }));

const TABS = ["day", "month", "trip", "tasks", "phrases"];

let root: Root | undefined;
let host: HTMLElement;

async function mount(lang: (typeof LANGS)[number], tab: string) {
  setLang(lang);
  localStorage.clear();
  history.replaceState(null, "", `/?bienvenida=0&dia=5&vista=${tab}`);
  const { default: App } = await import("../App");
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => {
    root!.render(
      <ErrorBoundary>
        <TripProvider>
          <App />
        </TripProvider>
      </ErrorBoundary>,
    );
  });
  // el mapa se carga bajo demanda
  await act(async () => new Promise((r) => setTimeout(r, 30)));
}

beforeAll(installBrowserStubs);

afterEach(async () => {
  await act(async () => root?.unmount());
  host?.remove();
  vi.restoreAllMocks();
});

describe.each(LANGS)("la guía en %s", (lang) => {
  it.each(TABS)("pestaña %s: se pinta sin errores y sin fallos de accesibilidad", async (tab) => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    await mount(lang, tab);

    expect(host.querySelector(".crash")).toBeNull();
    expect(document.documentElement.lang).toBe(lang);
    expect(host.querySelector("main")!.textContent!.length).toBeGreaterThan(40);
    expect(errors).not.toHaveBeenCalled();

    // jsdom no calcula estilos reales: el contraste de color se revisa aparte, en el navegador
    const { violations } = await axe.run(host, {
      rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
    });
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
});

describe("ErrorBoundary", () => {
  it("muestra un aviso en lugar de una pantalla en blanco cuando un componente falla", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    setLang("en");
    const Boom = () => {
      throw new Error("boom");
    };
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    await act(async () =>
      root!.render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>,
      ),
    );
    expect(host.querySelector('[role="alert"]')?.textContent).toContain("Something went wrong");
    expect(host.textContent).toContain("boom");
  });
});
