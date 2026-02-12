import {
  describe, expect, jest, it, beforeEach,
} from '@jest/globals';
import { Component } from './component';
import type { ComponentProps } from '../services/types';

const TAG_DIV = 'div';
const TEST_UUID = 'test-uuid';
const CHILD_KEY = 'child';
const LIST_KEY = 'list';
const ATTR_KEY = 'data-test';
const ATTR_VALUE = 'test';
const EVENT_NAME = 'click';
const MOCK_EVENT_HANDLER = jest.fn();

jest.mock('uuid', () => ({
  v4: jest.fn(() => TEST_UUID),
}));

class TestComponent extends Component {
  constructor(props: Record<string, unknown> = {}) {
    super(TAG_DIV, props);
  }

  public componentDidMount(): void {}

  public componentDidUpdate(oldProps: ComponentProps, newProps: ComponentProps): boolean {
    return oldProps !== newProps;
  }

  public render(): DocumentFragment {
    return this.compile('<div>{{text}}</div>');
  }
}

describe('Component', () => {
  let component: TestComponent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createComponent = (props = {}): TestComponent => new TestComponent(props);

  const callProtected = <T = any>(
    comp: any,
    method: string,
    ...args: unknown[]
  ): T => comp[method](...args);

  it('constructor registers events and creates proxies', () => {
    component = createComponent();

    expect((component as any).props.__id).toBe(TEST_UUID);
  });

  it('setProps updates props and triggers CDU', () => {
    component = createComponent();
    const newProps = { test: 'value' };

    component.setProps(newProps);

    expect(component.props.test).toBe('value');
  });

  it('setProps returns early if nextProps is falsy', () => {
    component = createComponent();

    component.setProps(null as any);
    component.setProps(undefined as any);

    expect(component.props).toBeDefined();
  });

  it('setProps updates children when provided', () => {
    component = createComponent();
    const child = createComponent();

    component.setProps({
      [CHILD_KEY]: child,
    });

    expect((component as any)._children[CHILD_KEY]).toBe(child);
  });

  it('setProps updates lists', () => {
    component = createComponent();
    const listItem = createComponent();

    component.setProps({
      [LIST_KEY]: [listItem],
    });

    expect((component as any)._lists[LIST_KEY]).toContain(listItem);
  });

  it('show/hide modify element display', () => {
    component = createComponent();
    callProtected(component, '_createResources');

    component.show();
    expect(component.getContent()?.style.display).toBe('block');

    component.hide();
    expect(component.getContent()?.style.display).toBe('none');
  });

  it('compile replaces child stubs with actual content', () => {
    const child = createComponent();
    component = createComponent({ [CHILD_KEY]: child });
    callProtected(component, '_createResources');

    const fragment = component.compile(`<div>{{{${CHILD_KEY}}}}</div>`);

    expect(fragment.querySelector(`[data-id="${child.id}"]`)).toBeTruthy();
  });

  it('compile handles lists with Component instances', () => {
    const listItem = createComponent();
    component = createComponent({ [LIST_KEY]: [listItem] });
    callProtected(component, '_createResources');

    const fragment = component.compile(`<div>{{{${LIST_KEY}}}}</div>`);

    expect(fragment.querySelector(`[data-id="${listItem.id}"]`)).toBeTruthy();
  });

  it('compile handles lists with non-Component items', () => {
    component = createComponent({ [LIST_KEY]: ['text1', 'text2'] });
    callProtected(component, '_createResources');

    const fragment = component.compile(`<div>{{{${LIST_KEY}}}}</div>`);

    expect(fragment.textContent).toContain('text1');
    expect(fragment.textContent).toContain('text2');
  });

  it('compile returns early when list stub is missing', () => {
    const listItem = createComponent();
    component = createComponent({ [LIST_KEY]: [listItem] });
    callProtected(component, '_createResources');

    const fragment = component.compile('<div>no placeholder</div>');

    expect(fragment.querySelector(`[data-id="${listItem.id}"]`)).toBeNull();
  });

  it('componentDidUpdate returns true when props differ', () => {
    component = createComponent();
    const oldProps = { test: 'old' };
    const newProps = { test: 'new' };

    const result = component.componentDidUpdate(oldProps, newProps);

    expect(result).toBe(true);
  });

  it('dispatchComponentDidMount emits FLOW_RENDER when children exist', () => {
    const child = createComponent();
    component = createComponent({ [CHILD_KEY]: child });

    const eventBusSpy = jest.spyOn((component as any)._eventBus(), 'emit');
    const childDispatchSpy = jest.spyOn(child, 'dispatchComponentDidMount');

    component.dispatchComponentDidMount();

    expect(eventBusSpy).toHaveBeenCalledWith(Component.EVENTS.FLOW_CDM);
    expect(eventBusSpy).toHaveBeenCalledWith(Component.EVENTS.FLOW_RENDER);
    expect(childDispatchSpy).toHaveBeenCalled();
  });

  it('_componentDidUpdate calls _render', () => {
    component = createComponent();
    callProtected(component, '_createResources');

    const renderSpy = jest.spyOn(component as any, '_render');
    const componentDidUpdateSpy = jest.spyOn(
      component,
      'componentDidUpdate',
    ).mockReturnValue(true);

    callProtected(component, '_componentDidUpdate', { old: 'value' }, { new: 'value' });

    expect(componentDidUpdateSpy).toHaveBeenCalled();
    expect(renderSpy).toHaveBeenCalled();
  });

  it('_makePropsProxy throws on delete attempt', () => {
    component = createComponent({ test: 'value' });

    expect(() => {
      delete (component as any)._props.test;
    }).toThrow('Нет доступа');
  });

  it('_addEvents/_removeEvents handle events', () => {
    component = createComponent({
      events: { [EVENT_NAME]: MOCK_EVENT_HANDLER },
    });

    callProtected(component, '_createResources');
    const element = component.getContent()!;

    const addSpy = jest.spyOn(element, 'addEventListener');
    const removeSpy = jest.spyOn(element, 'removeEventListener');

    callProtected(component, '_addEvents');
    expect(addSpy).toHaveBeenCalledWith(EVENT_NAME, MOCK_EVENT_HANDLER);

    callProtected(component, '_removeEvents');
    expect(removeSpy).toHaveBeenCalledWith(EVENT_NAME, MOCK_EVENT_HANDLER);
  });

  it('_makePropsProxy binds function values', () => {
    const mockFn = jest.fn();
    component = createComponent();
    const props = { method: mockFn };
    const proxy = callProtected(component, '_makePropsProxy', props);

    proxy.method();

    expect(mockFn).toHaveBeenCalled();
  });

  it('_getChildren separates components, arrays, and props', () => {
    component = createComponent();
    const child = createComponent();
    const listItems = [createComponent(), 'text'];
    const propsAndChildren = {
      [CHILD_KEY]: child,
      [LIST_KEY]: listItems,
      text: 'value',
    };

    const result = callProtected(component, '_getChildren', propsAndChildren);

    expect(result.children[CHILD_KEY]).toBe(child);
    expect(result.lists[LIST_KEY]).toBe(listItems);
    expect(result.props.text).toBe('value');
  });

  it('_render removes/adds events and updates content', () => {
    component = createComponent({
      events: { [EVENT_NAME]: MOCK_EVENT_HANDLER },
      attrs: { [ATTR_KEY]: ATTR_VALUE },
    });
    callProtected(component, '_createResources');

    callProtected(component, '_render');

    expect((component as any)._element?.getAttribute(ATTR_KEY)).toBe(ATTR_VALUE);
  });

  it('_componentDidMount calls CDM and children CDM', () => {
    const child = createComponent();
    component = createComponent({ [CHILD_KEY]: child });
    const childDispatchSpy = jest.spyOn(child, 'dispatchComponentDidMount');

    callProtected(component, '_componentDidMount');

    expect(childDispatchSpy).toHaveBeenCalled();
  });

  it('getContent returns element', () => {
    component = createComponent();
    callProtected(component, '_createResources');

    expect(component.getContent()).toBeDefined();
    expect(component.getContent()?.tagName).toBe('DIV');
  });

  it('id getter returns component id', () => {
    component = createComponent();

    expect(component.id).toBe(TEST_UUID);
  });

  it('props getter returns component props', () => {
    component = createComponent({ test: 'value' });

    expect(component.props.test).toBe('value');
  });
});
