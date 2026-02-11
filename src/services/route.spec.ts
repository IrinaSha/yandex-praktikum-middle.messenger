import {
  describe, expect, jest, beforeEach, afterEach, it,
} from '@jest/globals';
import { Route } from './route';

const ROOT_QUERY = '#app';

describe('Route', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('match(): should match static pathname', () => {
    const ViewClass: any = class {};
    const route = new Route('/home', ViewClass, { rootQuery: ROOT_QUERY });

    expect(route.match('/home')).toBe(true);
    expect(route.match('/other')).toBe(false);
  });

  /* it('match(): should match dynamic params like /users/:id', () => {
    const ViewClass: any = class {};
    const route = new Route('/users/:id', ViewClass, { rootQuery: ROOT_QUERY });

    expect(route.match('/users/123')).toBe(true);
    expect(route.match('/users/abc')).toBe(true);
    expect(route.match('/users/123/profile')).toBe(false);
    expect(route.match('/users')).toBe(false);
  });

  it('render(): should create view, render component into root, and call show()', () => {
    const node = document.createElement('div');
    node.textContent = 'content';

    const component = {
      getContent: jest.fn(() => node),
    };

    const show = jest.fn();
    const hide = jest.fn();

    const ViewClass: any = class {
      getContent = jest.fn(() => component);

      show = show;

      hide = hide;
    };

    const route = new Route('/home', ViewClass, { rootQuery: ROOT_QUERY });

    route.render();

    const root = document.querySelector(ROOT_QUERY) as HTMLElement;
    expect(root.firstChild).toBe(node);

    expect(component.getContent).toHaveBeenCalledTimes(1);
    expect(show).toHaveBeenCalledTimes(1);
    expect(hide).toHaveBeenCalledTimes(0);
  });

  it('render(): should not append if component.getContent() returns null', () => {
    const component = {
      getContent: jest.fn(() => null),
    };

    const show = jest.fn();

    const ViewClass: any = class {
      getContent = jest.fn(() => component);

      show = show;

      hide = jest.fn();
    };

    const route = new Route('/home', ViewClass, { rootQuery: ROOT_QUERY });

    route.render();

    const root = document.querySelector(ROOT_QUERY) as HTMLElement;
    expect(root.childNodes.length).toBe(0);
    expect(component.getContent).toHaveBeenCalledTimes(1);
    expect(show).toHaveBeenCalledTimes(1);
  });

  it('render(): return null from when root is not found ', () => {
    document.body.innerHTML = '';

    const component = {
      getContent: jest.fn(() => document.createElement('div')),
    };

    const show = jest.fn();

    const ViewClass: any = class {
      getContent = jest.fn(() => component);

      show = show;

      hide = jest.fn();
    };

    const route = new Route('/home', ViewClass, { rootQuery: ROOT_QUERY });

    route.render();

    expect(document.querySelector(ROOT_QUERY)).toBeNull();
    expect(show).toHaveBeenCalledTimes(1);
  });

  it('navigate(): should render only when match() is true', () => {
    const component = { getContent: jest.fn(() => document.createElement('div')) };

    const show = jest.fn();

    const ViewClass: any = class {
      getContent = jest.fn(() => component);

      show = show;

      hide = jest.fn();
    };

    const route = new Route('/home', ViewClass, { rootQuery: ROOT_QUERY });

    const renderSpy = jest.spyOn(route as any, 'render');

    route.navigate('/nope');
    expect(renderSpy).toHaveBeenCalledTimes(0);

    route.navigate('/home');
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('leave(): should call hide and clear view when view exists; otherwise do nothing', () => {
    const component = { getContent: jest.fn(() => document.createElement('div')) };

    const show = jest.fn();
    const hide = jest.fn();

    const ViewClass: any = class {
      getContent = jest.fn(() => component);

      show = show;

      hide = hide;
    };

    const route = new Route('/home', ViewClass, { rootQuery: ROOT_QUERY });

    route.leave();
    expect(hide).toHaveBeenCalledTimes(0);

    route.render();
    expect(show).toHaveBeenCalledTimes(1);

    route.leave();
    expect(hide).toHaveBeenCalledTimes(1);

    route.leave();
    expect(hide).toHaveBeenCalledTimes(1);
  });

  it('isProtected(): should return false by default and true when protected prop is set', () => {
    const ViewClass: any = class {};

    const route1 = new Route('/a', ViewClass, { rootQuery: ROOT_QUERY });
    expect(route1.isProtected()).toBe(false);

    const route2 = new Route('/b', ViewClass, { rootQuery: ROOT_QUERY, protected: true });
    expect(route2.isProtected()).toBe(true);

    const route3 = new Route('/c', ViewClass, { rootQuery: ROOT_QUERY, protected: false });
    expect(route3.isProtected()).toBe(false);
  });
*/
});
