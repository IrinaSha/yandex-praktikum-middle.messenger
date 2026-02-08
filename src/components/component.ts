import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';
import { EventBus } from '../services/event-bus';
import type {
  PropsAndChildren,
  ComponentProps,
  BlockMeta,
  PropsValue,
  ComponentList,
} from '../services/types';

export class Component {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  protected _props: ComponentProps;

  private _children: Record<string, Component>;

  _lists: Record<string, ComponentList>;

  private _id = '';

  private _element?: HTMLElement;

  private _meta: BlockMeta;

  private _eventBus: () => EventBus;

  private _setUpdate = false;

  constructor(tagName = 'div', propsAndChildren = {}) {
    this._meta = { tagName, propsAndChildren };
    this._id = makeUUID();

    const { children, props, lists } = this._getChildren(propsAndChildren);

    this._children = this._makePropsProxy(children);
    this._lists = this._makePropsProxy(lists);
    this._props = this._makePropsProxy({ ...props, __id: this._id });

    const eventBus = new EventBus();

    this._eventBus = () => eventBus;
    this._registerEvents(eventBus);

    eventBus.emit(Component.EVENTS.INIT);
  }

  public get id(): string {
    return this._id;
  }

  public get props(): ComponentProps {
    return this._props;
  }

  public init(): void {
    this._createResources();
    this._eventBus().emit(Component.EVENTS.FLOW_RENDER);
  }

  public show(): void {
    const content = this.getContent();

    if (content) {
      content.style.display = 'block';
    }
  }

  public hide(): void {
    const content = this.getContent();

    if (content) {
      content.style.display = 'none';
    }
  }

  public setProps = (nextProps: Record<string, unknown>): void => {
    if (!nextProps) {
      return;
    }

    this._setUpdate = false;

    const oldProps = { ...this._props };

    const propsAndChildren = this._getChildren(nextProps);

    if (Object.values(propsAndChildren?.props).length) {
      Object.assign(this._props, propsAndChildren?.props);
    }

    if (Object.values(propsAndChildren?.children).length) {
      Object.assign(this._children, propsAndChildren?.children);
    }

    if (Object.values(propsAndChildren?.lists).length) {
      Object.assign(this._lists, propsAndChildren?.lists);
    }

    if (this._setUpdate) {
      this._eventBus().emit(Component.EVENTS.FLOW_CDU, oldProps, nextProps);
      this._setUpdate = false;
    }
  };

  public render(tmpl = ''): DocumentFragment {
    return this.compile(tmpl, this._props);
  }

  public compile(tmpl: string, props = this._props): DocumentFragment {
    const propsAndStubs = { ...props };

    Object.entries(this._children)?.forEach(([key, child]: [string, Component]) => {
      propsAndStubs[key] = `<div data-id="${child.id}"></div>`;
    });

    Object.entries(this._lists)?.forEach(([key]: [string, ComponentList]) => {
      propsAndStubs[key] = `<div data-id="__l_${key}"></div>`;
    });

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;

    if (fragment) {
      fragment.innerHTML = Handlebars.compile(tmpl)(propsAndStubs);
    }

    Object.values(this._children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);

      if (stub) {
        stub.replaceWith(child.getContent()!);
      }
    });

    Object.entries(this._lists).forEach(([key, children]) => {
      const stub = fragment.content.querySelector(`[data-id="__l_${key}"]`);

      if (!stub) {
        return;
      }

      const listContent = this._createDocumentElement('template') as HTMLTemplateElement;

      if (!listContent) {
        return;
      }

      children.forEach((child) => {
        if (child instanceof Component) {
          listContent.content.append(child.getContent()!);
        } else {
          listContent.content.append(`${child}`);
        }
      });

      stub?.replaceWith(listContent.content);
    });

    return fragment.content;
  }

  public getContent(): HTMLElement | undefined {
    return this._element;
  }

  public componentDidMount(): void {
  }

  public componentDidUpdate(oldProps: ComponentProps, newProps: ComponentProps): boolean {
    return oldProps !== newProps;
  }

  public dispatchComponentDidMount(): void {
    this._eventBus().emit(Component.EVENTS.FLOW_CDM);

    if (Object.keys(this._children).length) {
      this._eventBus().emit(Component.EVENTS.FLOW_RENDER);
    }
  }

  private _getChildren(propsAndChildren: Record<string, unknown>): PropsAndChildren {
    const children: Record<string, Component> = {};
    const props: Record<string, PropsValue> = {};
    const lists: Record<string, ComponentList> = {};

    Object.keys(propsAndChildren).forEach((key: string) => {
      const value = propsAndChildren[key];

      if (value instanceof Component) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        props[key] = value as PropsValue;
      }
    });

    return { children, props, lists };
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources(): void {
    const { tagName } = this._meta;

    this._element = this._createDocumentElement(tagName);
  }

  private _componentDidMount(): void {
    this.componentDidMount();

    Object.values(this._children).forEach((child: Component) => child.dispatchComponentDidMount());
  }

  private _componentDidUpdate(oldProps: ComponentProps, newProps: ComponentProps): void {
    const isUpdated = this.componentDidUpdate(oldProps, newProps);

    if (isUpdated) {
      this._render();
    }
  }

  protected _render(): void {
    this._removeEvents();

    const block = this.render();

    if (this._element) {
      this._element.innerHTML = '';
      this._element.appendChild(block);
    }

    this._addAttributes();
    this._addEvents();
  }

  private _makePropsProxy<T extends Record<string, unknown>>(props: T): T {
    if (!props) {
      return {} as T;
    }

    const self = this;

    return new Proxy(props, {
      get(target, prop): unknown {
        const value = target[prop as keyof T];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, newValue): boolean {
        (target as Record<string | symbol, unknown>)[prop] = newValue;
        self._setUpdate = true;

        return true;
      },
      deleteProperty(): boolean {
        throw new Error('Нет доступа');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    const element = document.createElement(tagName);

    element.setAttribute('data-id', this._id);

    return element;
  }

  private _addAttributes(): void {
    const { attrs = {} } = this._props;

    Object.entries(attrs).forEach(([key, value]) => {
      this._element?.setAttribute(key, String(value));
    });
  }

  private _addEvents(): void {
    const { events = {} } = this._props;

    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this._props;

    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }
}
