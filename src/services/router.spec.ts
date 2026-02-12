import {
  describe, expect, jest, beforeEach, afterEach, it,
} from '@jest/globals';
import { Router } from './router';
import { Component } from '../components/component';
import { View } from '../view/view';
import { Link } from '../components/link/link';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

class TestView extends View {
  getContent(): Component {
    return new Link('span', {
      attrs: { class: 'test' },
      url: '/',
      title: 'Test',
    });
  }
}

class ProtectedView extends View {
  getContent(): Component {
    return new Link('span', {
      attrs: { class: 'protected' },
      url: '/messenger',
      title: 'Protected',
    });
  }
}

describe('Router', () => {
  let router: Router;
  let container: HTMLElement;

  beforeEach(() => {
    (Router as any).__instance = undefined;
    container = document.createElement('div');
    container.className = 'app';
    document.body.appendChild(container);
    window.history.pushState({}, '', '/');
    router = Router.getInstance('.app');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.onpopstate = null;
    jest.clearAllMocks();
  });

  it('getInstance() создает singleton', () => {
    const router2 = Router.getInstance();
    expect(router).toBe(router2);
  });

  it('use() добавляет маршрут и возвращает this', () => {
    const result = router.use('/test', TestView);
    expect(result).toBe(router);
    expect((router as any).routes).toHaveLength(1);
  });

  it('use() добавляет защищенный маршрут', () => {
    router.use('/protected', ProtectedView, true);
    expect((router as any).routes[0].isProtected()).toBe(true);
  });

  it('setAuthCheck() устанавливает callback', () => {
    const callback = jest.fn(async () => true);
    router.setAuthCheck(callback);
    expect((router as any)._checkAuthCallback).toBe(callback);
  });

  it('start() перенаправляет авторизованного с / на /messenger', async () => {
    router.setAuthCheck(async () => true);
    router.use('/messenger', ProtectedView, true);
    const goSpy = jest.spyOn(router, 'go');
    await router.start();
    expect(goSpy).toHaveBeenCalledWith('/messenger');
  });

  it('start() перенаправляет авторизованного с /sign-up на /messenger', async () => {
    window.history.pushState({}, '', '/sign-up');
    router.setAuthCheck(async () => true);
    router.use('/messenger', ProtectedView, true);
    const goSpy = jest.spyOn(router, 'go');
    await router.start();
    expect(goSpy).toHaveBeenCalledWith('/messenger');
  });

  it('start() устанавливает onpopstate и вызывает _onRoute', async () => {
    router.use('/', TestView);
    await router.start();
    expect(window.onpopstate).not.toBeNull();
  });

  it('_interceptLinks() перехватывает клики', async () => {
    router.use('/test', TestView);
    await router.start();
    const link = document.createElement('a');
    link.href = '/test';
    document.body.appendChild(link);
    const goSpy = jest.spyOn(router, 'go');
    link.click();
    expect(goSpy).toHaveBeenCalledWith('/test');
  });

  it('_interceptLinks() игнорирует не-ссылки', async () => {
    await router.start();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const goSpy = jest.spyOn(router, 'go');
    div.click();
    expect(goSpy).not.toHaveBeenCalled();
  });

  it('_interceptLinks() игнорирует ссылки без href', async () => {
    await router.start();
    const link = document.createElement('a');
    document.body.appendChild(link);
    const goSpy = jest.spyOn(router, 'go');
    link.click();
    expect(goSpy).not.toHaveBeenCalled();
  });

  it('_interceptLinks() игнорирует внешние ссылки', async () => {
    await router.start();
    const link = document.createElement('a');
    link.href = 'https://external.com';
    document.body.appendChild(link);
    const goSpy = jest.spyOn(router, 'go');
    link.click();
    expect(goSpy).not.toHaveBeenCalled();
  });

  it('go() переходит на маршрут', async () => {
    router.use('/test', TestView);
    await router.go('/test');
    expect(window.location.pathname).toBe('/test');
  });

  it('back() вызывает history.back()', () => {
    const spy = jest.spyOn(window.history, 'back');
    router.back();
    expect(spy).toHaveBeenCalled();
  });

  it('forward() вызывает history.forward()', () => {
    const spy = jest.spyOn(window.history, 'forward');
    router.forward();
    expect(spy).toHaveBeenCalled();
  });

  it('back/forward без history не падает', () => {
    (router as any).history = undefined;
    expect(() => router.back()).not.toThrow();
    expect(() => router.forward()).not.toThrow();
  });

  it('_onRoute() рендерит 404 для несуществующего маршрута', async () => {
    await router.go('/unknown');
    expect(container.textContent).toContain('не найдена');
    expect(document.title).toBe('404 - Страница не найдена');
  });

  it('_onRoute() перенаправляет неавторизованного с защищенного маршрута', async () => {
    router.setAuthCheck(async () => false);
    router.use('/', TestView);
    router.use('/protected', ProtectedView, true);
    const goSpy = jest.spyOn(router, 'go');
    await router.go('/protected');
    expect(goSpy).toHaveBeenCalledWith('/');
  });

  it('_onRoute() перенаправляет авторизованного с / на /messenger', async () => {
    router.setAuthCheck(async () => true);
    router.use('/', TestView);
    router.use('/messenger', ProtectedView, true);
    const goSpy = jest.spyOn(router, 'go');
    await router.go('/');
    expect(goSpy).toHaveBeenCalledWith('/messenger');
  });

  it('_onRoute() перенаправляет авторизованного с /sign-up на /messenger', async () => {
    router.setAuthCheck(async () => true);
    router.use('/sign-up', TestView);
    router.use('/messenger', ProtectedView, true);
    const goSpy = jest.spyOn(router, 'go');
    await router.go('/sign-up');
    expect(goSpy).toHaveBeenCalledWith('/messenger');
  });

  it('_onRoute() вызывает leave() при смене маршрута', async () => {
    router.use('/first', TestView);
    router.use('/second', TestView);
    await router.go('/first');
    const leaveSpy = jest.spyOn((router as any)._currentRoute, 'leave');
    await router.go('/second');
    expect(leaveSpy).toHaveBeenCalled();
  });

  it('_onRoute() не вызывает leave() для маршрута с параметрами', async () => {
    router.use('/user/:id', TestView);
    await router.go('/user/123');
    (router as any)._currentRoute._pathname = '/user/:id';
    const leaveSpy = jest.spyOn((router as any)._currentRoute, 'leave');
    await router.go('/user/456');
    expect(leaveSpy).not.toHaveBeenCalled();
  });

  it('_render404() очищает _currentRoute и вызывает leave()', async () => {
    router.use('/test', TestView);
    await router.go('/test');
    const leaveSpy = jest.spyOn((router as any)._currentRoute, 'leave');
    await router.go('/unknown');
    expect(leaveSpy).toHaveBeenCalled();
    expect((router as any)._currentRoute).toBeNull();
  });

  it('getParams() возвращает параметры маршрута', async () => {
    router.use('/user/:id', TestView);
    await router.go('/user/123');
    expect(router.getParams()).toEqual({ id: '123' });
  });

  it('getParams() возвращает несколько параметров', async () => {
    router.use('/user/:userId/post/:postId', TestView);
    await router.go('/user/123/post/456');
    expect(router.getParams()).toEqual({ userId: '123', postId: '456' });
  });

  it('getParams() возвращает {} для маршрута без параметров', async () => {
    router.use('/test', TestView);
    await router.go('/test');
    expect(router.getParams()).toEqual({});
  });

  it('getParams() возвращает {} для несуществующего маршрута', async () => {
    await router.go('/unknown');
    expect(router.getParams()).toEqual({});
  });

  describe('Навигация с popstate', () => {
    it('должен обрабатывать событие popstate при history.back()', async () => {
      router.use('/', TestView).use('/page', TestView);
      await router.start();

      await router.go('/page');

      const onRouteSpy = jest.spyOn(router as any, '_onRoute');

      window.history.back();
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));

      expect(onRouteSpy).toHaveBeenCalled();
    });
  });

  describe('Базовая функциональность', () => {
    it('должен создать экземпляр и перейти на маршрут', () => {
      router.use('/', TestView).start();
      router.go('/');
      expect(router).toBeInstanceOf(Router);
      expect(window.location.pathname).toBe('/');
    });
  });
});
