import { EventBus } from '../services/EventBus.ts';
import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';
import type {PropsAndChildren} from "../services/types.ts";

export class Component {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render',
    };

    _props: any;
    _children: any;
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
        this._children = children;
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

        Object.assign(this._props, nextProps);
    };

    render(tmpl = ''): DocumentFragment {
        const htmlString = Handlebars.compile(tmpl)(this._props);

        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();

        return template.content;
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
    }

    _getChildren(propsAndChildren: any): PropsAndChildren {
        const children: Record<string, Component> = {};
        const props: Record<string, any> = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Component) {
                children[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { children, props };
    }

    _registerEvents(eventBus: EventBus) {
        eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    _createResources() {
        const { tagName } = this._meta;

        this._element = this._createDocumentElement(tagName);
    }

    _componentDidMount() {
        this.componentDidMount();
    }

    _componentDidUpdate(oldProps: any, newProps: any) {
        const response = this.componentDidUpdate(oldProps, newProps);

        if (response) {
            this._render();
        }
    }

    _render() {
        this._removeEvents();

        const block = this.render();

        if (this._element) {
            this._element.innerHTML = '';
        }

        this._element?.appendChild(block);
        this._addAttributes();
        this._addEvents();
    }

    _makePropsProxy(props: any) {
        const self = this;

        return new Proxy(props, {
                get(target, prop) {
                    const value = target[prop];
                    return typeof value === 'function' ? value.bind(target) : value;
                },
                set(target, prop, newValue) {
                    const old = {...target};
                    target[prop] = newValue;

                    self._eventBus().emit(Component.EVENTS.FLOW_CDU, old, target);

                    return true;
                },
                deleteProperty() {
                    throw new Error('Нет доступа');
                }
            }
        );
    }

    _createDocumentElement(tagName: string) {
        const element = document.createElement(tagName);

        element.setAttribute('data-id', this._id);

        return element;
    }

    _addAttributes() {
        const {attrs = {}} = this._props;

        Object.entries(attrs).forEach(([key, value]) => {
            this._element?.setAttribute(key, String(value));
        });
    }

    _addEvents() {
        const {events = {}} = this._props;

        Object.keys(events).forEach(eventName => {
            this._element?.addEventListener(eventName, events[eventName]);
        });
    }

    _removeEvents() {
        const {events = {}} = this._props;

        Object.keys(events).forEach(eventName => {
            this._element?.removeEventListener(eventName, events[eventName]);
        });
    }
}
