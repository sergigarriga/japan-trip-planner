// jsdom no implementa algunas APIs del navegador que usa la guía: se sustituyen por versiones vacías.

export function installBrowserStubs() {
  const g = globalThis as Record<string, unknown>;
  g.IS_REACT_ACT_ENVIRONMENT = true;
  g.__BUILD_TIME__ = "2027-01-01T00:00:00.000Z";
  g.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  g.fetch = () => Promise.reject(new Error("sin red en los tests"));
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  g.IntersectionObserver = Observer;
  g.ResizeObserver = Observer;
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
  };
}
