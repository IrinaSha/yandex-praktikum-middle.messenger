import type { View } from '../view/view';
import type { Component } from '../components/component';

function render(query: string, component: Component): HTMLElement | null {
  const root = document.querySelector(query);

  if (root) {
    root.innerHTML = '';
    const content = component.getContent();
    if (content) {
      root.appendChild(content);
    }
  }

  return root as HTMLElement | null;
}

export class Route {
  private _pathname: string;

  private _ViewClass: typeof View;

  private _view: View | null = null;

  private _props: { rootQuery: string; protected?: boolean };

  constructor(
    pathname: string,
    ViewClass: typeof View,
    props: { rootQuery: string; protected?: boolean },
  ) {
    this._pathname = pathname;
    this._ViewClass = ViewClass;
    this._props = props;
  }

  public navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  public leave(): void {
    if (this._view) {
      this._view.hide();
      this._view = null;
    }
  }

  public match(pathname: string): boolean {
    const routeRegex = new RegExp(`^${this._pathname.replace(/:[^\s/]+/g, '([^/]+)')}$`);
    return routeRegex.test(pathname);
  }

  public render(): void {
    this._view = new this._ViewClass();

    const component = this._view.getContent();

    render(this._props.rootQuery, component);

    this._view.show();
  }

  public isProtected(): boolean {
    return this._props.protected || false;
  }
}
