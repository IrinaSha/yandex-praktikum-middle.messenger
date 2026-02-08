import type { View } from '../view/view';
import type { Component } from '../components/component';
import { ErrorView } from '../view/view-error';//избавиться!!!

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

  constructor(pathname: string, ViewClass: typeof View, props: { rootQuery: string; protected?: boolean }) {
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
    //return this._pathname === pathname;

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

export class Router {
  private routes: Route[] = [];
  private history?: History;
  private _rootQuery?: string;
  private _currentRoute: Route | null = null;
  private static __instance: Router;
  private _checkAuthCallback?: () => Promise<boolean>;

  private constructor(rootQuery: string) {
    this.routes = [];
    this.history = window.history;
    this._rootQuery = rootQuery;
  }

  public static getInstance(rootQuery: string = '.app'): Router {
    if (!Router.__instance) {
      Router.__instance = new Router(rootQuery);
    }

    return Router.__instance;
  }

  public use(pathname: string, ViewClass: typeof View, isProtected: boolean = false): Router {
    const route = new Route(pathname, ViewClass, {
      rootQuery: this._rootQuery || '',
      protected: isProtected
    });
    this.routes.push(route);

    return this;
  }

  public setAuthCheck(callback: () => Promise<boolean>): void {
    this._checkAuthCallback = callback;
  }

  public async start(): Promise<void> {
    if (this._checkAuthCallback) {
      const isAuthenticated = await this._checkAuthCallback();

      if (isAuthenticated && (window.location.pathname === '/' || window.location.pathname === '/sign-up' )) {
        this.go('/messenger');
        return;
      }
    }

    window.onpopstate = (event: PopStateEvent) => {
      const target = event.currentTarget as Window;
      this._onRoute(target.location.pathname);
    };

    this._interceptLinks();
    await this._onRoute(window.location.pathname);
  }

  private _interceptLinks(): void {
    document.addEventListener('click', (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a');

      if (!link?.href) return;

      const url = new URL(link.href);

      if (url.origin === window.location.origin) {
        event.preventDefault();
        event.stopPropagation();
        this.go(url.pathname);
      }
    });
  }

  private async _onRoute(pathname: string): Promise<void> {
    const route = this.getRoute(pathname);

    if (!route) {
      this._render404(pathname);
      return;
    }

    if (this._checkAuthCallback) {
      const isAuthenticated = await this._checkAuthCallback();

      if (route.isProtected() && !isAuthenticated) {
        this.go('/');
        return;
      }

      if (isAuthenticated && (pathname === '/' || pathname === '/sign-up')) {
        this.go('/messenger');
        return;
      }
    }

    this._renderRoute(route);
  }

  private _renderRoute(route: Route): void {
    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  private _render404(pathname: string): void {
    if (this._currentRoute) {
      this._currentRoute.leave();
      this._currentRoute = null;
    }

    const errorView = new ErrorView('404', `Страница "${pathname}" не найдена`);
    const root = document.querySelector(this._rootQuery || '.app');

    if (root) {
      root.innerHTML = '';
      const content = errorView.getContent().getContent();
      if (content) {
        root.appendChild(content);
      }
    }

    document.title = '404 - Страница не найдена';
  }

  public getParams(): Record<string, string> {
    const route = this.getRoute(window.location.pathname);

    if (!route) {
      return {};
    }

    const values = window.location.pathname.match(new RegExp(`^${(route as any)._pathname.replace(/:[^\s/]+/g, '([^/]+)')}$`));
    const keys = (route as any)._pathname.match(/:[^\s/]+/g);

    if (!values || !keys) {
      return {};
    }

    return keys.reduce((acc: any, key: string, i: number) => {
      acc[key.substring(1)] = values[i + 1];
      return acc;
    }, {});
  }

  public go(pathname: string): void {
    this.history?.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  public back(): void {
    this.history?.back();
  }

  public forward(): void {
    this.history?.forward();
  }

  private getRoute(pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname));
  }
}
