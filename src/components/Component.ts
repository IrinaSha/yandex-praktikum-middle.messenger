import { EventBus } from '../services/EventBus.ts';
import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';
import type {PropsAndChildren} from "../services/types.ts";

/*export class Component2 {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render',
    };

    _props: any;
    _children: Component;
    _id: string = '';
    _element?: HTMLElement;
    _meta: any = null;
    _eventBus: () => EventBus;
    _setUpdate = false;

    get element(): HTMLElement | undefined {
        return this._element;
    }

    constructor(tagName = 'div', propsAndChildren = {}) {
        console.log(`constructor(tagName = ${{tagName}}, props = {})`);

        this._meta = {
            tagName,
            propsAndChildren
        };

        this._id = makeUUID();

        const { children, props } = this._getChildren(propsAndChildren);
        this._children = this._makePropsProxy(children);
        this._props = this._makePropsProxy({ ...props, __id: this._id });

        const eventBus = new EventBus();

        this._eventBus = () => eventBus;
        this._registerEvents(eventBus);

        eventBus.emit(Component.EVENTS.INIT);
    }

    init() {
        this._createResources();
        this._eventBus().emit(Component.EVENTS.FLOW_RENDER);
    }

    show() {
        const content =  this.getContent();

        if (content) {
            content.style.display = 'block';
        }
    }

    hide() {
        const content =  this.getContent();

        if (content) {
            content.style.display = 'none';
        }
    }

    setProps = (nextProps: any) => {
        if (!nextProps) {
            return;
        }

        this._setUpdate = false;
        const oldVal = { ...this._props };

        const propsAndChildren = this._getChildren(nextProps);

        if (Object.values(propsAndChildren?.props).length) {
            Object.assign(this._props, propsAndChildren?.props);
        }

        if (Object.values(propsAndChildren?.children).length) {
            Object.assign(this._props, propsAndChildren?.children);
        }

        if (this._setUpdate) {
            this._eventBus().emit(Component.EVENTS.FLOW_CDU, oldVal, nextProps);

            this._setUpdate = false;
        }
    };

    render(tmpl = ''): DocumentFragment {
        return this.compile(tmpl, this._props);
    }

    compile(tmpl: string, props: any) {
        const propsAndStubs = { ...props };

        Object.entries(this._children).forEach(([key, child]: any) => {
            propsAndStubs[key] = `<div data-id="${child._id}"></div>`
        });

        const fragment = this._createDocumentElement('template');
        if (!fragment) {
            return '';
        }

        fragment.innerHTML = Handlebars.compile(tmpl)(propsAndStubs);//Templator.compile(template, propsAndStubs);

        Object.values(this._children).forEach(child => {
            const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

            stub.replaceWith(child.getContent());
        });

        return fragment.content;
    }

    getContent(): HTMLElement | undefined {
        return this.element;
    }

    componentDidMount() {

    }

    componentDidUpdate(oldProps: any, newProps: any) {
        return oldProps !== newProps;
    }

    dispatchComponentDidMount() {
        this._eventBus().emit(Component.EVENTS.FLOW_CDM);

        if (Object.keys(this._children).length) {
            this._eventBus().emit(Component.EVENTS.FLOW_RENDER);
        }
    }

    private _getChildren(propsAndChildren: any): PropsAndChildren {
        const children: Record<string, Component> = {};
        const props: Record<string, any> = {};
        const lists: Record<string, Component> = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Component) {
                children[key] = value;
            } else {
                props[key] = value;
            }
        });

    }

    private _registerEvents(eventBus: EventBus) {
        eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _createResources() {
        const { tagName } = this._meta;

        this._element = this._createDocumentElement(tagName);
    }

    private _componentDidMount() {
        this.componentDidMount();

        Object.values(this._children).forEach((child: any) => child.dispatchComponentDidMount());
    }

    private _componentDidUpdate(oldProps: any, newProps: any) {
        const isUpdated = this.componentDidUpdate(oldProps, newProps);

        if (isUpdated) {
            this._render();
        }
    }

    private _render() {
        this._removeEvents();

        const block = this.render();

        if (this._element) {
            this._element.innerHTML = '';
        }

        this._element?.appendChild(block);
        this._addAttributes();
        this._addEvents();
    }

    private _makePropsProxy(props: any) {
        const self = this;

        return new Proxy(props, {
                get(target, prop) {
                    const value = target[prop];
                    return typeof value === 'function' ? value.bind(target) : value;
                },
                set(target, prop, newValue) {
                    //const old = {...target};

                    target[prop] = newValue;

                    self._setUpdate = true;
                    //self._eventBus().emit(Component.EVENTS.FLOW_CDU, old, target);

                    return true;
                },
                deleteProperty() {
                    throw new Error('Нет доступа');
                }
            }
        );
    }

    private _createDocumentElement(tagName: string): any {
        const element = document.createElement(tagName);

        element.setAttribute('data-id', this._id);

        return element;
    }

    private _addAttributes() {
        const {attrs = {}} = this._props;

        Object.entries(attrs).forEach(([key, value]) => {
            this._element?.setAttribute(key, String(value));
        });
    }

    private _addEvents() {
        const {events = {}} = this._props;

        Object.keys(events).forEach(eventName => {
            this._element?.addEventListener(eventName, events[eventName]);
        });
    }

    private _removeEvents() {
        const {events = {}} = this._props;

        Object.keys(events).forEach(eventName => {
            this._element?.removeEventListener(eventName, events[eventName]);
        });
    }
}
*/
export class Component {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render',
    };

    _props: any;
    _children: Component;
    _lists: Component;
    _id: string = '';
    _element?: HTMLElement;
    _meta: any = null;
    _eventBus: () => EventBus;
    _setUpdate = false;

    get element(): HTMLElement | undefined {
        return this._element;
    }

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

    init() {
        this._createResources();
        this._eventBus().emit(Component.EVENTS.FLOW_RENDER);
    }

    show() {
        const content =  this.getContent();

        if (content) {
            content.style.display = 'block';
        }
    }

    hide() {
        const content =  this.getContent();

        if (content) {
            content.style.display = 'none';
        }
    }

    setProps = (nextProps: any) => {
        if (!nextProps) {
            return;
        }

        this._setUpdate = false;
        const oldVal = { ...this._props };

        const propsAndChildren = this._getChildren(nextProps);

        if (Object.values(propsAndChildren?.props).length) {
            Object.assign(this._props, propsAndChildren?.props);
        }

        if (Object.values(propsAndChildren?.children).length) {
            Object.assign(this._props, propsAndChildren?.children);
        }

        if (this._setUpdate) {
            this._eventBus().emit(Component.EVENTS.FLOW_CDU, oldVal, nextProps);

            this._setUpdate = false;
        }
    };

    render(tmpl = ''): DocumentFragment {
        return this.compile(tmpl, this._props);
    }

    compile(tmpl: string, props = this._props) {
        const propsAndStubs = { ...props };

        Object.entries(this._children)?.forEach(([key, child]: any) => {
            propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
        });

        Object.entries(this._lists)?.forEach(([key]: any) => {
            propsAndStubs[key] = `<div data-id="__l_${key}"></div>`;
        });

        const fragment = this._createDocumentElement('template');
        if (fragment) {
            fragment.innerHTML = Handlebars.compile(tmpl)(propsAndStubs);
        }

        Object.values(this._children).forEach(child => {
            const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

            if (stub) {
                stub.replaceWith(child.getContent());
            }
        });

        Object.entries(this._lists).forEach(([key, children]: any) => {
            const stub = fragment.content.querySelector(`[data-id="__l_${key}"]`);

            if (!stub) {
                return;
            }

            const listContent = this._createDocumentElement('template');

            if (!listContent) {
               return;
            }

            children.forEach((child: any) => {
                if (child instanceof Component) {
                    listContent.content.append(child.getContent());
                } else {
                    listContent.content.append(`${child}`);
                }
            });

            stub?.replaceWith(listContent.content);
        });

        return fragment.content;
    }

    getContent(): HTMLElement | undefined {
        return this.element;
    }

    componentDidMount() {

    }

    componentDidUpdate(oldProps: any, newProps: any) {
        return oldProps !== newProps;
    }

    dispatchComponentDidMount() {
        this._eventBus().emit(Component.EVENTS.FLOW_CDM);

        if (Object.keys(this._children).length) {
            this._eventBus().emit(Component.EVENTS.FLOW_RENDER);
        }
    }

    private _getChildren(propsAndChildren: any): PropsAndChildren {
        const children: Record<string, Component> = {};
        const props: Record<string, any> = {};
        const lists: Record<string, Component> = {};

        Object.keys(propsAndChildren).forEach((key: string) => {
            const value = propsAndChildren[key];

            if (value instanceof Component) {
                children[key] = value;
            } else if (Array.isArray(value)) {
                //@ts-ignore
                lists[key] = value;
            } else {
                props[key] = propsAndChildren[key];
            }
        });

        return { children, props, lists };
    }

    private _registerEvents(eventBus: EventBus) {
        eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _createResources() {
        const { tagName } = this._meta;

        this._element = this._createDocumentElement(tagName);
    }

    private _componentDidMount() {
        this.componentDidMount();

        Object.values(this._children).forEach((child: any) => child.dispatchComponentDidMount());
    }

    private _componentDidUpdate(oldProps: any, newProps: any) {
        const isUpdated = this.componentDidUpdate(oldProps, newProps);

        if (isUpdated) {
            this._render();
        }
    }

    private _render() {
        this._removeEvents();

        const block = this.render();

        if (this._element) {
            this._element.innerHTML = '';
        }

        this._element?.appendChild(block);
        this._addAttributes();
        this._addEvents();
    }

    private _makePropsProxy(props: any) {
        if (!props) {
            return {};
        }

        const self = this;

        return new Proxy(props, {
                get(target, prop) {
                    const value = target[prop];
                    return typeof value === 'function' ? value.bind(target) : value;
                },
                set(target, prop, newValue) {
                    //const old = {...target};

                    target[prop] = newValue;

                    self._setUpdate = true;
                    //self._eventBus().emit(Component.EVENTS.FLOW_CDU, old, target);

                    return true;
                },
                deleteProperty() {
                    throw new Error('Нет доступа');
                }
            }
        );
    }

    private _createDocumentElement(tagName: string): any {
        const element = document.createElement(tagName);

        element.setAttribute('data-id', this._id);

        return element;
    }

    private _addAttributes() {
        const { attrs = {} } = this._props;

        Object.entries(attrs).forEach(([key, value]) => {
            this._element?.setAttribute(key, String(value));
        });
    }

    private _addEvents() {
        const {events = {}} = this._props;

        Object.keys(events).forEach(eventName => {
            this._element?.addEventListener(eventName, events[eventName]);
        });
    }

    private _removeEvents() {
        const {events = {}} = this._props;

        Object.keys(events).forEach(eventName => {
            this._element?.removeEventListener(eventName, events[eventName]);
        });
    }
}
