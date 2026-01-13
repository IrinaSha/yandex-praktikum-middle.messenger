import type { View } from '../view/view';
import type { Component } from '../components/component';
import { ErrorView } from '../view/view-error'; // Импортируем ErrorView

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
  private _props: { rootQuery: string };

  constructor(pathname: string, ViewClass: typeof View, props: { rootQuery: string }) {
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
    }
  }

  public match(pathname: string): boolean {
    return this._pathname === pathname;
  }

  public render(): void {
    if (!this._view) {
      this._view = new this._ViewClass();
      const component = this._view.getContent();
      render(this._props.rootQuery, component);
    }

    this._view.show();
  }
}

export class Router {
  private routes: Route[] = [];
  private history?: History;
  private _rootQuery?: string;
  private _currentRoute: Route | null = null;
  private static __instance: Router;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  public use(pathname: string, ViewClass: typeof View): Router {
    const route = new Route(pathname, ViewClass, { rootQuery: this._rootQuery || '' });
    this.routes.push(route);
    return this;
  }

  public start(): void {
    window.onpopstate = (event: PopStateEvent) => {
      const target = event.currentTarget as Window;
      this._onRoute(target.location.pathname);
    };

    // Перехват кликов по ссылкам
    this._interceptLinks();

    this._onRoute(window.location.pathname);
  }

  private _interceptLinks(): void {
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const url = new URL(link.href);

        // Проверяем, что это внутренняя ссылка
        if (url.origin === window.location.origin) {
          event.preventDefault();
          this.go(url.pathname);
        }
      }
    });
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (!route) {
      this._render404(pathname);
      return;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  private _render404(pathname: string): void {
    // Очищаем текущий маршрут
    if (this._currentRoute) {
      this._currentRoute.leave();
      this._currentRoute = null;
    }

    // Создаем и рендерим страницу ошибки
    const errorView = new ErrorView('404', `Страница "${pathname}" не найдена`);
    const root = document.querySelector(this._rootQuery || '.app');

    if (root) {
      root.innerHTML = '';
      const content = errorView.getContent().getContent();
      if (content) {
        root.appendChild(content);
      }
    }

    // Обновляем title страницы
    document.title = '404 - Страница не найдена';
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
